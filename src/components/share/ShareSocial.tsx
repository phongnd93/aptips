import { useEffect, useRef, useState } from 'react';
import { Box, Button, Card, CardContent, CardHeader, Fab, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { varFade } from '../animate';
import { m } from 'framer-motion';
import { useSnackbar } from 'notistack';
import CopyToClipboard from 'react-copy-to-clipboard';
import Iconify from '../Iconify';
import { QRCode } from 'react-qrcode-logo';

const SOCIAL = [
    { label: 'Twitter', value: 'twitter', icon: 'hugeicons:new-twitter-rectangle', color: '#657786' },
    { label: 'Telegram', value: 'telegram', icon: 'mingcute:telegram-fill', color: '#0088cc' },
    { label: 'Discord', value: 'discord', icon: 'mingcute:whatsapp-fill', color: '#7289d9' },
    { label: 'Facebook', value: 'facebook', icon: 'mingcute:facebook-fill', color: '#4267B2' },
    { label: 'WhatsApp', value: 'whatsapp', icon: 'mingcute:whatsapp-fill', color: '#25D366' },
    { label: 'Other', value: 'other', icon: 'fluent:share-16-regular', color: '#AAB8C2' }
]

export default function ShareSocial(props: { value?: string })
{

    const { value } = props;
    const { enqueueSnackbar } = useSnackbar();

    const qrRef = useRef<any>({});
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [link, setLink] = useState('');
    const [social, setSocial] = useState('');
    const [logoImage, setLogoImage] = useState<any>();
    const [newValue, setNewValue] = useState({
        value: '',
        copied: false
    });

    const onCopy = () =>
    {
        setNewValue({ ...newValue, copied: true });
        if (newValue.value)
        {
            enqueueSnackbar('Copied!');
        }
    };

    const handleSetNewValue = (social: string) =>
    {
        if (social !== 'other')
        {
            setNewValue({ value: `${link}?utm_source=${social}`, copied: false });
            setSocial(social);
        }
        else
        {
            setNewValue({ value: `${link}?utm_source=`, copied: false });
            setSocial(social);
        }
    };

    const retrievePathFile = (files: any) =>
    {
        const file = files[0];

        if (!file) { return false; }

        if (file.type !== 'image/png' && file.type !== 'image/jpeg')
        {
            console.error('Only png and jpg/jpeg allowed.')
        }
        else
        {
            const target: any = {};
            const reader = new FileReader();
            reader.onload = (e) =>
            {
                target.name = file.name;
                target.value = reader.result
                target.logoName = file.name;
                setLogoImage(target);
            }
            reader.readAsDataURL(file);
        }
    };

    useEffect(() =>
    {
        if (typeof window !== 'undefined' && value)
        {
            const { protocol, hostname, port } = window.location;
            const link = `${protocol}//${hostname}${(hostname === 'localhost' && port) ? `:${port}` : ''}/donation/${value}`;

            setNewValue({ value: link, copied: false });
            setLink(link);
        }
    }, [value]);

    return (
        <>
            <Card>
                <CardHeader
                    title={
                        <Stack direction={'row'} spacing={1} alignItems={'center'}>
                            <Typography variant='h4'>Share</Typography>
                            <Tooltip title="Click QR Code to change image">
                                <Fab color='primary' sx={{ width: '2.2rem', height: '1rem' }}>
                                    <Iconify icon="icons8:question-mark" width={24} height={24} />
                                </Fab>
                            </Tooltip>
                        </Stack>
                    }
                />
                <CardContent>
                    <Stack spacing={3} alignItems={'center'}>
                        <Box
                            sx={{
                                display: 'flex',
                                overflowY: 'auto',
                                width: 500,
                                paddingBottom: 1.5,
                                gap: 1,
                            }}
                        >
                            {SOCIAL.map((s) => (
                                <m.div
                                    key={s.label}
                                    variants={varFade().in}
                                    onClick={() => handleSetNewValue(s.value)}
                                >
                                    <CategoryCard category={s} />
                                </m.div>
                            ))}
                        </Box>
                        <Box
                            onClick={() => fileInputRef.current?.click()}
                            sx={{ cursor: 'pointer' }}
                        >
                            <QRCode
                                ref={qrRef}
                                qrStyle='fluid'
                                size={250}
                                logoPadding={5}
                                logoPaddingStyle={'circle'}
                                logoWidth={80}
                                logoHeight={80}
                                logoImage={logoImage?.value}
                                value={newValue.value}
                            />
                        </Box>
                        <Box
                            width={'100%'}
                        >
                            <TextField
                                value={newValue.value}
                                InputProps={{
                                    endAdornment: (
                                        <>
                                            {newValue.value.includes('utm_source') &&
                                                (
                                                    <InputAdornment position="end">
                                                        <CopyToClipboard
                                                            text={newValue.value}
                                                            onCopy={onCopy}
                                                        >
                                                            <Tooltip title="Copy">
                                                                <IconButton>
                                                                    <Iconify icon={'eva:copy-fill'} width={24} height={24} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </CopyToClipboard>
                                                    </InputAdornment>
                                                )}
                                        </>
                                    ),
                                }}
                                onChange={(event) =>
                                {
                                    setNewValue({ value: event.target.value, copied: false });
                                }}
                                fullWidth
                                disabled={social === 'other' ? false : true}
                            />
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
            {/** Area */}
            <input
                ref={fileInputRef}
                type='file'
                name='logoImage'
                accept='image/*'
                hidden
                onChange={(event) => { retrievePathFile(event.target.files) }}
            />
        </>
    );
};

type CategoryCardProps = {
    category: {
        label: string;
        icon: string;
        color: string;
    };
};

function CategoryCard({ category }: CategoryCardProps)
{

    const { label, icon, color } = category;

    return (
        <>
            <Paper
                variant="outlined"
                sx={{
                    p: 1.5,
                    height: 100,
                    width: 100,
                    borderRadius: 1.5,
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': { boxShadow: (theme) => theme.customShadows.z24 },
                }}
            >
                <Iconify
                    icon={icon}
                    width={40}
                    height={40}
                    color={color}
                    sx={{ mb: 1 }}
                />
                <Typography
                    variant="subtitle2"
                    color={color}
                >
                    {label}
                </Typography>
            </Paper>
        </>
    );
}