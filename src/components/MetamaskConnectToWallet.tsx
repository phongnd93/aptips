import { LoadingButton } from "@mui/lab";
import { Stack } from "@mui/material";
import React from "react";
import Iconify from './Iconify';
import useChainAuth from "src/hooks/useChainAuth";

export const MetamaskConnectToWallet: React.FC = () =>
{
    const { metamaskInstalled, login } = useChainAuth();

    const handleClick = () =>
    {
        if (metamaskInstalled)
        {
            login();
        } else
        {
            const url = 'https://metamask.io/download.html';
            window.open(url, '_blank');
        }

    };

    return <LoadingButton
        fullWidth
        size="large"
        variant="contained"
        sx={[{ bgcolor: '#f58420', fontSize: '16px', color: '#FFF', borderRadius: '22px', boxShadow: '0 8px 16px 0 #f5842096' }, {
            '&:hover': {
                background: '#c26615'
            }
        }, {
            '&:hover:active': {
                background: "#f58420c7",
            }
        }]}
        onClick={handleClick}
    >
        <Stack direction={'row'} spacing={1} alignContent={"baseline"} alignItems={"center"}>
            <Iconify icon={'logos:metamask-icon'} width={32} height={32} />
            <span>{metamaskInstalled ? "Connect to wallet" : "Install metamask wallet"}</span>
        </Stack>
    </LoadingButton>;
};
