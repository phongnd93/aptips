import { SuiClient, SuiTransactionBlockResponse, getFullnodeUrl } from '@mysten/sui.js/client';
import { SerializedSignature, decodeSuiPrivateKey } from '@mysten/sui.js/cryptography';
import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import
{
    genAddressSeed,
    generateNonce,
    generateRandomness,
    getExtendedEphemeralPublicKey,
    getZkLoginSignature,
    jwtToAddress,
} from '@mysten/zklogin';
import { NetworkName } from '@polymedia/suits';
import { jwtDecode } from 'jwt-decode';
import { SUI_CONFIG } from '../config';

/* Types */

export type OpenIdProvider = 'Google' | 'Twitch' | 'Facebook';

type SetupData = {
    provider: OpenIdProvider;
    maxEpoch: number;
    randomness: string;
    ephemeralPrivateKey: string;
}

export type AccountData = {
    provider: OpenIdProvider;
    userAddr: string;
    zkProofs: any;
    ephemeralPrivateKey: string;
    userSalt: string;
    sub: string;
    aud: string;
    maxEpoch: number;
}
export default class SuiSDK
{
    NETWORK: NetworkName = 'devnet';
    MAX_EPOCH = 2; // keep ephemeral keys active for this many Sui epochs from now (1 epoch ~= 24h)

    suiClient = new SuiClient({ url: getFullnodeUrl(this.NETWORK) });
    /* Session storage keys */

    setupDataKey = 'zklogin-demo.setup';
    accountDataKey = 'zklogin-demo.accounts';
    config = SUI_CONFIG;
    constructor(client: SuiClient)
    {
        if (client)
            this.suiClient = client

    }
    /* zkLogin end-to-end */

    /**
     * Start the zkLogin process by getting a JWT token from an OpenID provider.
     * https://docs.sui.io/concepts/cryptography/zklogin#get-jwt-token
     */
    beginZkLogin = async (provider: OpenIdProvider) =>
    {
        // Create a nonce
        const { epoch } = await this.suiClient.getLatestSuiSystemState();
        const maxEpoch = Number(epoch) + this.MAX_EPOCH; // the ephemeral key will be valid for MAX_EPOCH from now
        const ephemeralKeyPair = new Ed25519Keypair();
        const randomness = generateRandomness();
        const nonce = generateNonce(ephemeralKeyPair.getPublicKey(), maxEpoch, randomness);

        // Save data to session storage so completeZkLogin() can use it after the redirect
        this.saveSetupData({
            provider,
            maxEpoch,
            randomness: randomness.toString(),
            ephemeralPrivateKey: ephemeralKeyPair.getSecretKey(),
        });

        // Start the OAuth flow with the OpenID provider
        const urlParamsBase = {
            nonce: nonce,
            redirect_uri: `${window.location.origin}/dashboard`,
            response_type: 'id_token',
            scope: 'openid',
        };
        let loginUrl: string;
        switch (provider)
        {
            case 'Google': {
                const urlParams = new URLSearchParams({
                    ...urlParamsBase,
                    client_id: this.config.CLIENT_ID_GOOGLE,
                });
                loginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${urlParams.toString()}`;
                break;
            }
            case 'Twitch': {
                const urlParams = new URLSearchParams({
                    ...urlParamsBase,
                    client_id: this.config.CLIENT_ID_TWITCH,
                    force_verify: 'true',
                    lang: 'en',
                    login_type: 'login',
                });
                loginUrl = `https://id.twitch.tv/oauth2/authorize?${urlParams.toString()}`;
                break;
            }
            case 'Facebook': {
                const urlParams = new URLSearchParams({
                    ...urlParamsBase,
                    client_id: this.config.CLIENT_ID_FACEBOOK,
                });
                loginUrl = `https://www.facebook.com/v19.0/dialog/oauth?${urlParams.toString()}`;
                break;
            }
        }
        window.location.replace(loginUrl);
    }

    /**
     * Complete the zkLogin process.
     * It sends the JWT to the salt server to get a salt, then
     * it derives the user address from the JWT and the salt, and finally
     * it gets a zero-knowledge proof from the Mysten Labs proving service.
     */
    completeZkLogin = async (): Promise<AccountData | null> =>
    {
        // === Grab and decode the JWT that beginZkLogin() produced ===
        // https://docs.sui.io/concepts/cryptography/zklogin#decoding-jwt

        // grab the JWT from the URL fragment (the '#...')
        const urlFragment = window.location.hash.substring(1);
        const urlParams = new URLSearchParams(urlFragment);
        const jwt = urlParams.get('id_token');
        if (!jwt)
        {
            return null;
        }

        // remove the URL fragment
        window.history.replaceState(null, '', window.location.pathname);

        // decode the JWT
        const jwtPayload = jwtDecode(jwt);
        if (!jwtPayload.sub || !jwtPayload.aud)
        {
            console.warn('[completeZkLogin] missing jwt.sub or jwt.aud');
            return null;
        }

        // === Get the salt ===
        // https://docs.sui.io/concepts/cryptography/zklogin#user-salt-management

        const requestOptions =
            this.config.URL_SALT_SERVICE === '/dummy-salt-service.json'
                ? // dev, using a JSON file (same salt all the time)
                {
                    method: 'GET',
                }
                : // prod, using an actual salt server
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jwt }),
                };

        const saltResponse: { salt: string } | null =
            await fetch(this.config.URL_SALT_SERVICE, requestOptions)
                .then(res =>
                {
                    console.debug('[completeZkLogin] salt service success');
                    return res.json();
                })
                .catch((error: unknown) =>
                {
                    console.warn('[completeZkLogin] salt service error:', error);
                    return null;
                });

        if (!saltResponse)
        {
            return null;
        }

        const userSalt = BigInt(saltResponse.salt);

        // === Get a Sui address for the user ===
        // https://docs.sui.io/concepts/cryptography/zklogin#get-the-users-sui-address

        const userAddr = jwtToAddress(jwt, userSalt);

        // === Load and clear the data which beginZkLogin() created before the redirect ===
        const setupData = this.loadSetupData();
        if (!setupData)
        {
            console.warn('[completeZkLogin] missing session storage data');
            return null;
        }

        // === Get the zero-knowledge proof ===
        // https://docs.sui.io/concepts/cryptography/zklogin#get-the-zero-knowledge-proof

        const ephemeralKeyPair = this.keypairFromSecretKey(setupData.ephemeralPrivateKey);
        const ephemeralPublicKey = ephemeralKeyPair.getPublicKey();
        const payload = JSON.stringify({
            maxEpoch: setupData.maxEpoch,
            jwtRandomness: setupData.randomness,
            extendedEphemeralPublicKey: getExtendedEphemeralPublicKey(ephemeralPublicKey),
            jwt,
            salt: userSalt.toString(),
            keyClaimName: 'sub',
        }, null, 2);

        console.debug('[completeZkLogin] Requesting ZK proof with:', payload);

        const zkProofs = await fetch(this.config.URL_ZK_PROVER, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload,
        })
            .then(res =>
            {
                console.debug('[completeZkLogin] ZK proving service success');
                return res.json();
            })
            .catch((error: unknown) =>
            {
                console.warn('[completeZkLogin] ZK proving service error:', error);
                return null;
            })
            .finally(() =>
            {

            });

        if (!zkProofs)
        {
            console.warn('[completeZkLogin] ZkProofs is undefined');
            return null;
        }

        // === Save data to session storage so sendTransaction() can use it ===
        const account = {
            provider: setupData.provider,
            userAddr,
            zkProofs,
            ephemeralPrivateKey: setupData.ephemeralPrivateKey,
            userSalt: userSalt.toString(),
            sub: jwtPayload.sub,
            aud: typeof jwtPayload.aud === 'string' ? jwtPayload.aud : jwtPayload.aud[0],
            maxEpoch: setupData.maxEpoch,
        };
        this.saveAccount(account);
        this.clearSetupData();
        return account;
    }

    /**
    * Assemble a zkLogin signature and submit a transaction
    * https://docs.sui.io/concepts/cryptography/zklogin#assemble-the-zklogin-signature-and-submit-the-transaction
    */
    sendTransaction = async (toWallet: string, account: AccountData, txb: TransactionBlock, callback: (result: SuiTransactionBlockResponse) => void) =>
    {
        // Sign the transaction bytes with the ephemeral private key
        // const txb = new TransactionBlock();
        txb.setSender(account.userAddr);

        const ephemeralKeyPair = this.keypairFromSecretKey(account.ephemeralPrivateKey);
        const { bytes, signature: userSignature } = await txb.sign({
            client: this.suiClient,
            signer: ephemeralKeyPair,
        });

        // Generate an address seed by combining userSalt, sub (subject ID), and aud (audience)
        const addressSeed = genAddressSeed(
            BigInt(account.userSalt),
            'sub',
            account.sub,
            account.aud,
        ).toString();

        // Serialize the zkLogin signature by combining the ZK proof (inputs), the maxEpoch,
        // and the ephemeral signature (userSignature)
        const zkLoginSignature: SerializedSignature = getZkLoginSignature({
            inputs: {
                ...account.zkProofs,
                addressSeed,
            },
            maxEpoch: account.maxEpoch,
            userSignature,
        });
        // Execute the transaction
        await this.suiClient.executeTransactionBlock({
            transactionBlock: bytes,
            signature: zkLoginSignature,
            options: {
                showEffects: true,
            },
        })
            .then(result =>
            {
                callback(result);
            })
            .catch((error: unknown) =>
            {
                console.warn('[sendTransaction] executeTransactionBlock failed:', error);
                return null;
            })
            .finally(() =>
            {

            });
    }

    /**
     * Create a keypair from a base64-encoded secret key
     */
    keypairFromSecretKey = (privateKeyBase64: string): Ed25519Keypair =>
    {
        const keyPair = decodeSuiPrivateKey(privateKeyBase64);
        return Ed25519Keypair.fromSecretKey(keyPair.secretKey);
    }

    /**
    * Get the SUI balance for each account
    */
    fetchBalances = async (walletAddress: string): Promise<Map<string, number> | null> =>
    {
        if (!walletAddress)
        {
            return null;
        }
        const newBalances = new Map<string, number>();
        const suiBalance = await this.suiClient.getBalance({
            owner: walletAddress,
            coinType: '0x2::sui::SUI',
        });
        newBalances.set(
            walletAddress,
            +suiBalance.totalBalance / 1_000_000_000
        );
        return newBalances;
    }

    /* Session storage */
    saveSetupData = (data: SetupData) =>
    {
        window.sessionStorage.setItem(this.setupDataKey, JSON.stringify(data))
    }

    loadSetupData = (): SetupData | null =>
    {
        const dataRaw = window.sessionStorage.getItem(this.setupDataKey);
        if (!dataRaw)
        {
            return null;
        }
        const data: SetupData = JSON.parse(dataRaw);
        return data;
    }

    clearSetupData = (): void =>
    {
        window.sessionStorage.removeItem(this.setupDataKey);
    }

    saveAccount = (account: AccountData): void =>
    {
        sessionStorage.setItem(this.accountDataKey, JSON.stringify(account));
    }

    loadAccount = (): AccountData | null =>
    {
        const dataRaw = window.sessionStorage.getItem(this.accountDataKey);
        if (!dataRaw)
        {
            return null;
        }
        const data: AccountData = JSON.parse(dataRaw);
        return data;
    }

    clearState = (): void =>
    {
        window.sessionStorage.clear();
        // accounts.current = [];
        // setBalances(new Map());
    }
}