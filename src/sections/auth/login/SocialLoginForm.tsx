import { Popover, Stack, Typography } from "@mui/material";
import { LoadingButton } from '@mui/lab';
import { useState } from "react";
import Iconify from "src/components/Iconify";
import React from "react";

type SocialLoginFormProps = {
    onSocialClick: (provider: 'Google' | 'Facebook' | 'Twitch') => void,
    onConnectToWalletClick: () => void
}

const SocialLoginForm: React.FC<SocialLoginFormProps> = ({ onSocialClick, onConnectToWalletClick }) =>
{
    const [isSubmitting, setIsSubmitting] = useState<'Google' | 'Facebook' | 'Twitch' | 'Wallet' | null>(null);
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleComingSoonClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () =>
    {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    return <Stack spacing={3} fontFamily={'Inter'}>
        <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={isSubmitting === 'Google'}
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
                setIsSubmitting('Google');
                onSocialClick('Google');
            }}
        >
            <Stack direction={'row'} spacing={1} alignContent={"baseline"} alignItems={'center'}>
                <Iconify icon={'eva:google-fill'} width={24} height={24} />
                <span>Join with Google</span>
            </Stack>

        </LoadingButton>
        <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={isSubmitting === 'Facebook'}
            sx={[{ bgcolor: '#F3F6FBFF', fontSize: '1rem', color: '#335CA6FF', borderRadius: '22px', boxShadow: '0 8px 16px 0 #335ca63d' }, {
                '&:hover': {
                    color: '#335CA6FF',
                    background: '#F0F4FAFF'
                }
            }, {
                '&:hover:active': {
                    color: "#335CA6FF",
                    background: "#E7ECF7FF",
                }
            }]}
            onClick={handleComingSoonClick}
        // onClick={() =>
        // {
        //     setIsSubmitting('Facebook');
        //     onSocialClick('Facebook');
        // }}
        >
            <Stack direction={'row'} spacing={1} alignContent={"baseline"} alignItems={"center"}>
                <Iconify icon={'eva:facebook-fill'} width={24} height={24} />
                <span>Join with Facebook</span>
            </Stack>
        </LoadingButton>
        <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={isSubmitting === 'Twitch'}
            sx={[{ bgcolor: '#F7F0FEFF', fontSize: '1rem', color: '#9B48F7FF', borderRadius: '22px', boxShadow: '0 8px 16px 0 #9b48f73d' }, {
                '&:hover': {
                    color: '#9B48F7FF',
                    background: '#F5EDFFFF'
                }
            }, {
                '&:hover:active': {
                    color: "#9B48F7FF",
                    background: "#F1E6FEFF",
                }
            }]}
            onClick={handleComingSoonClick}
        // onClick={() =>
        // {
        //     setIsSubmitting('Twitch');
        //     onSocialClick('Twitch')
        // }}
        >
            <Stack direction={'row'} spacing={1} alignContent={"baseline"} alignItems={"center"}>
                <Iconify icon={'mdi:twitch'} width={24} height={24} />
                <span>Join with Twitch</span>
            </Stack>
        </LoadingButton>
        <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={isSubmitting === 'Wallet'}
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
            onClick={onConnectToWalletClick}
        >
            <Stack direction={'row'} spacing={1} alignContent={"baseline"} alignItems={"center"}>
                <Iconify icon={'token-branded:sui'} width={32} height={32} />
                <span>Connect to wallet</span>
            </Stack>
        </LoadingButton>
        <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
        >
            <Stack direction={"column"} justifyContent={"center"} sx={{ p: 2 }}>
                <Typography variant="h5" sx={{ color: (theme) => theme.palette.primary.main }}>Coming Soon!</Typography>
                <Typography variant="body1" >We are currently working hard on this feature!</Typography>
            </Stack>
        </Popover>
    </Stack >

};

export default SocialLoginForm;