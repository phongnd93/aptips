import { useState } from 'react';
import { Box, Card, CardContent, CardHeader, IconButton, InputAdornment, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { varFade } from '../animate';
import { m } from 'framer-motion';
import { useSnackbar } from 'notistack';
import CopyToClipboard from 'react-copy-to-clipboard';
import Iconify from '../Iconify';

const SOCIAL = [
    { label: 'WhatsApp', value: 'whatsapp', icon: 'mingcute:whatsapp-fill', color: '#25D366' },
    { label: 'Facebook', value: 'facebook', icon: 'mingcute:facebook-fill', color: '#4267B2' },
    { label: 'Twitter', value: 'twitter', icon: 'hugeicons:new-twitter-rectangle', color: '#657786'},
    { label: 'Other', value: 'other', icon : 'fluent:share-16-regular', color: '#AAB8C2' }
]

export default function ShareSocial (props: { value?: string }) {

    const { value = 'suidona.subcli.top/abcxyz123456' } = props;
    const { enqueueSnackbar } = useSnackbar();

    const [newValue, setNewValue] = useState({
        value,
        copied: false 
    });

    const onCopy = () => {
        setNewValue({ ...newValue, copied: true });
        if (newValue.value) {
          enqueueSnackbar('Copied!');
        }
    };

    const handleSetNewValue = (social: string) =>
    {
        if (social !== 'other')
        {
            setNewValue({ value:`${value}/utm_source=${social}`, copied: false })
        }
        else
        {
            setNewValue({ value: value, copied: false })
        }
    };

    return (
        <Card>
            <CardHeader
                title='Share'
            />
            <CardContent>
                <Stack spacing={3}>
                    <Box
                        sx={{
                            display: 'flex',
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
                    <Box>
                        <Typography variant='subtitle2' sx={{ mb: 1 }}>Share this link</Typography>
                        <TextField
                            value={newValue.value}
                            InputProps={{
                                endAdornment: (
                                <InputAdornment position="end">
                                    <CopyToClipboard text={newValue.value} onCopy={onCopy}>
                                    <Tooltip title="Copy">
                                        <IconButton>
                                        <Iconify icon={'eva:copy-fill'} width={24} height={24} />
                                        </IconButton>
                                    </Tooltip>
                                    </CopyToClipboard>
                                </InputAdornment>
                                ),
                            }}
                            fullWidth
                            disabled
                        />
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

type CategoryCardProps = {
    category: {
      label: string;
      icon: string;
      color: string;
    };
  };
  
function CategoryCard({ category }: CategoryCardProps) {

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