import { AnyAptosWallet, groupAndSortWallets, isInstallRequired } from "@aptos-labs/wallet-adapter-core";
import { useWallet, WalletItem } from "@aptos-labs/wallet-adapter-react";
import { LoadingButton } from "@mui/lab";
import { Box, Button, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { DialogAnimate } from "src/components/animate";
import Iconify from "src/components/Iconify";

const AptosLoginForm: FC = () =>
{
    const { wallets = [] } = useWallet();

    const { aptosConnectWallets, availableWallets, installableWallets } =
        groupAndSortWallets(wallets);

    const hasAptosConnectWallets = !!aptosConnectWallets.length;
    const [open, setOpen] = useState(false);
    const handleClose = () =>
    {
        setOpen(false);
    };
    console.log(availableWallets);
    return <>
        <Stack direction={'column'} gap={2}>
            {
                hasAptosConnectWallets && <>
                    {aptosConnectWallets.map((wallet) => (
                        <AptosConnectWalletRow
                            key={wallet.name}
                            wallet={wallet}
                            onConnect={() => {}}
                        />
                    ))}
                </>
            }
            <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                sx={[{ bgcolor: '#FDF2F2FF', fontSize: '16px', color: '#DE3B40FF', borderRadius: '22px', boxShadow: '0 8px 16px 0 rgb(222 59 64 / 24%)' }, {
                    '&:hover': {
                        color: '#DE3B40FF',
                        background: '#F9DBDCFF'
                    }
                }, {
                    '&:hover:active': {
                        color: "#DE3B40FF",
                        background: "#F5C4C6FF",
                    }
                }]}
                onClick={() =>
                {
                    setOpen(true);
                }}
            >
                <Stack direction={'row'} spacing={1} alignContent={"baseline"} alignItems={"center"}>
                    <Iconify icon={'token:aptos'} width={32} height={32} />
                    <span>Connect to wallet</span>
                </Stack>
            </LoadingButton>
        </Stack>
        <DialogAnimate open={open} onClose={handleClose}>
            <DialogTitle id="alert-dialog-title">Login with Aptos Connect</DialogTitle>
            <DialogContent>
                <Stack gap={1} sx={{ mt: 2 }}>
                    {availableWallets.map((wallet) => (
                        <WalletRow key={wallet.name} wallet={wallet} />
                    ))}
                </Stack>
                <Stack justifyContent={'center'} textAlign={'center'}>
                    <Typography variant='body1'>-- OR --</Typography>
                </Stack>
                <Stack gap={1}>
                    {installableWallets.map((wallet) => (
                        <WalletRow key={wallet.name} wallet={wallet} />
                    ))}
                </Stack>
            </DialogContent>
            {/* <DialogActions>
      <Button onClick={handleClose}>Disagree</Button>
      <Button variant="contained" onClick={handleClose} autoFocus>
        Agree
      </Button>
    </DialogActions> */}
        </DialogAnimate>
    </>
}
interface WalletRowProps
{
    wallet: AnyAptosWallet;
    onConnect?: () => void;
}
function WalletRow({ wallet, onConnect }: WalletRowProps)
{
    return (
        <WalletItem
            wallet={wallet}
            onConnect={onConnect}
            className='w-full'
        >

            {isInstallRequired(wallet) ? (
                <WalletItem.ConnectButton asChild>
                    <Stack direction={'row'} justifyContent={'space-between'} sx={{ border: '1px solid lightgrey', py: 1, px: 2, borderRadius: '1rem' }}>
                        <Stack gap={4} direction={'row'} alignContent={'center'}>
                            <Box sx={{ width: 36 }}>
                                <WalletItem.Icon />
                            </Box>
                            <WalletItem.Name />
                        </Stack>
                        <Button type='button' size="small">
                            <WalletItem.InstallLink />
                        </Button>
                    </Stack>

                </WalletItem.ConnectButton>
            ) : (
                <WalletItem.ConnectButton asChild>
                    <Stack direction={'row'} justifyContent={'space-between'} sx={{ border: '1px solid lightgrey', py: 1, px: 2, borderRadius: '1rem' }}>
                        <Stack gap={4} direction={'row'} alignContent={'center'}>
                            <Box sx={{ width: 36 }}>
                                <WalletItem.Icon />
                            </Box>
                            <WalletItem.Name />
                        </Stack>
                        <Button type='button' size="small">Connect</Button>
                    </Stack>
                </WalletItem.ConnectButton>
            )}
        </WalletItem>
    );
}

function AptosConnectWalletRow({ wallet, onConnect }: WalletRowProps)
{
    return (
        <WalletItem wallet={wallet} onConnect={onConnect} className='w-full'>
            <WalletItem.ConnectButton asChild className='w-full'>
                <LoadingButton
                    fullWidth
                    size="large"
                    variant="contained"
                    sx={[{ bgcolor: '#F1F9FEFF', fontSize: '1rem', color: '#4ba2ff', borderRadius: '22px', boxShadow: '0 8px 16px 0 #60adff3d' }, {
                        '&:hover': {
                            color: '#0C476FFF',
                            background: '#E9F5FDFF'
                        }
                    }, {
                        '&:hover:active': {
                            color: "#0C476FFF",
                            background: "#D1EAFAFF",
                        }
                    }]}
                >
                    <Stack gap={2} direction={'row'}>
                        <WalletItem.Icon />
                        <WalletItem.Name />
                    </Stack>
                </LoadingButton>
            </WalletItem.ConnectButton>
        </WalletItem>
    );
}
export default AptosLoginForm;