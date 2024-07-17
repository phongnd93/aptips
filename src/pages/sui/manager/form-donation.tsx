import Layout from '../../../layouts';
import Page from '../../../components/Page';
import { Box, Button, Card, CardContent, Container, Dialog, Grid, IconButton, InputAdornment, OutlinedInput, Popover, Stack, TextField, ToggleButton } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { SUI_DONA_PATH } from 'src/routes/paths';
import { styled } from '@mui/material/styles';
import { QRCode } from 'react-qrcode-logo';
import { useRef, useState } from 'react';
import SvgIconStyle from 'src/components/SvgIconStyle';
import Iconify from 'src/components/Iconify';
import { FabButtonAnimate } from 'src/components/animate';
import { ShareSocial } from 'src/components/share';
import { Badge } from '@mui/material';

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(5),
  }));
  
// ----------------------------------------------------------------------
ManagerFormDonation.getLayout = function getLayout(page: React.ReactElement) {
    return <Layout>{page}</Layout>;
  };
// ----------------------------------------------------------------------

export default function ManagerFormDonation()
{
    const initTempConfig: Record<string, any> = {
        title: 'Donation',
        subtitle: 'Empower a Girl: For Self-Reliance',
        amount: ['1', '3', '5', false],
        logoImage: '',
        link: 'suidona.subcli.top/abcxyz123',
    }

    const [tempConfig, setTempConfig] = useState<Record<string, any>>(initTempConfig);
    const [isOpen, setOpen] = useState<null | HTMLElement>(null);
    const [isOpenDialog, setOpenDialog] = useState(false);
    const [newAmountSui, setNewAmountSui] = useState('');

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    const handleGenerateLink = () =>
    {
        console.log('test');
    }

    const fileInputRef = useRef<HTMLInputElement>(null);

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
                setTempConfig(prevState => ({...prevState, logoImage: target}))
            }
            reader.readAsDataURL(file);

        }
    };

    return (
        <Page title="Manager: Form Donation">
            <RootStyle>
                <Container>
                    <HeaderBreadcrumbs
                        heading='Manager Form Donation'
                        links={[
                            { name: 'Manager', href: SUI_DONA_PATH.manager.root },
                            { name: 'Manager Form Donation' },
                        ]}
                        action={(
                            <FabButtonAnimate
                                size='small'
                                color='info'
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <Iconify icon={'material-symbols:upload'} width={24} height={24} />
                            </FabButtonAnimate>
                        )}
                    />
                </Container>
            </RootStyle>
            <Container sx={{ mt: 5, mb: 5 }}>
                <Grid container spacing={6}>
                    <Grid item xs={6}>
                        <Card>
                            <CardContent>
                                <Box
                                    sx={{ 
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: 5
                                    }}
                                >
                                    <Box>
                                        <OutlinedInput
                                            size='small'
                                            placeholder='Title'
                                            defaultValue={tempConfig?.title || ''}
                                            onChange={(e) => setTempConfig(prevState => ({...prevState, title: e.target.value }))}
                                            sx={{
                                                typography: 'h3',
                                                fontWeight: 'bold',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'transparent',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    textAlign: 'center',
                                                    padding: 0,
                                                }
                                            }}
                                            fullWidth
                                        />
                                        <OutlinedInput
                                            size='small'
                                            placeholder='Sub Title'
                                            defaultValue={tempConfig?.subtitle || ''}
                                            onChange={(e) => setTempConfig(prevState => ({...prevState, subtitle: e.target.value }))}
                                            sx={{
                                                fontSize: 'large',
                                                color: 'text.secondary',
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor: 'transparent',
                                                },
                                                '& .MuiOutlinedInput-input': {
                                                    textAlign: 'center',
                                                    padding: 0,
                                                }
                                            }}
                                            fullWidth
                                        />
                                    </Box>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Stack spacing={3}>
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        bgcolor: '#D0F2FF',
                                                        p: 3,
                                                        borderRadius: '0.25rem' 
                                                    }}
                                                    gap={2}
                                                >
                                                    <SvgIconStyle src={`/icons/ic_sui.svg`} width={40} height={40} />
                                                    <Iconify icon={'eva:close-fill'} width={16} height={16}/>
                                                    {tempConfig.amount.map((a: any, index: number) => (
                                                        <>
                                                            {a 
                                                                ? (
                                                                    <Badge
                                                                        color={'default'}
                                                                        overlap='circular'
                                                                        badgeContent={(
                                                                            <IconButton
                                                                                size='small'
                                                                                onClick={() =>
                                                                                {
                                                                                    const temp = tempConfig.amount;
                                                                                    const newArr = temp.filter((_, i) => i !== index);
                                                                                    setTempConfig(prevState => ({...prevState, amount: newArr }));
                                                                                }}
                                                                            >
                                                                                <Iconify icon='carbon:close-filled' width={16} height={16} />
                                                                            </IconButton>
                                                                        )}
                                                                    >
                                                                        <ToggleButton
                                                                            className='form-donation-toggle-button'
                                                                            sx={{
                                                                                borderRadius: '50%',
                                                                                width: 40,
                                                                                height: 40,
                                                                                backgroundColor: 'white',
                                                                                color: 'deepskyblue',
                                                                            }}
                                                                            value={a}
                                                                        >
                                                                            {a}
                                                                        </ToggleButton>
                                                                    </Badge>
                                                                    
                                                                )
                                                                : (
                                                                    <OutlinedInput
                                                                        type='number'
                                                                        size='small'
                                                                        placeholder='Any Sui'
                                                                        sx={{ width: 120, bgcolor: 'white', borderRadius: 1 }}
                                                                        endAdornment={
                                                                            <InputAdornment position="end">
                                                                                <IconButton
                                                                                    size='small'
                                                                                    onClick={() =>
                                                                                    {
                                                                                        const temp = tempConfig.amount;
                                                                                        const newArr = temp.filter((_, i) => i !== index);
                                                                                        setTempConfig(prevState => ({...prevState, amount: newArr }));
                                                                                    }}
                                                                                >
                                                                                    <Iconify icon='carbon:close-filled' width={16} height={16} />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        }
                                                                    />
                                                                )
                                                            }
                                                        </>
                                                    ))}
                                                    <FabButtonAnimate
                                                        size='small'
                                                        color='info'
                                                        onClick={handleOpen}
                                                    >
                                                        <Iconify icon={'ic:round-plus'} width={16} height={16}/>
                                                    </FabButtonAnimate>
                                                </Box>
                                                <TextField
                                                    color='info'
                                                    label='Name'
                                                />
                                                <TextField
                                                    color='info'
                                                    rows={3}
                                                    placeholder='Say something nice...(optional)'
                                                    multiline
                                                />
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                        <Stack spacing={3} alignItems={'center'}>
                            <Card
                                sx={{ width: '100%'}}
                            >
                                <CardContent sx={{ textAlign: 'center' }}>
                                    <QRCode
                                        qrStyle='fluid'
                                        size={250}
                                        logoPadding={5}
                                        logoPaddingStyle={'circle'}
                                        logoWidth={50}
                                        logoHeight={50}
                                        logoImage={tempConfig?.logoImage?.value}
                                    />
                                    <input
                                        ref={fileInputRef}
                                        type='file'
                                        name='logoImage'
                                        accept='image/*'
                                        hidden
                                        onChange={(event) => {retrievePathFile(event.target.files)}}
                                    />
                                </CardContent>
                            </Card>
                            <OutlinedInput
                                color='info'
                                size='small'
                                fullWidth
                                onChange={handleGenerateLink}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={handleGenerateLink}
                                            edge="end"
                                        >
                                            <Iconify icon="mage:reload" width={24} height={24} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <Button
                                variant='contained'
                                color='info'
                                sx={{ width: 100, borderRadius: 5 }}
                            >
                                Share
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
            <Popover
                anchorEl={isOpen}
                open={Boolean(isOpen)}
                onClose={handleClose}
                sx={{ marginTop: 1 }}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Box sx={{ p: 1 }}>
                    <Button
                        sx={{ width: 100 }}
                        onClick={() => { handleClose(); setOpenDialog(true); }}
                    >
                        Sui Number
                    </Button>
                    <Button
                        sx={{ width: 100 }}
                        onClick={() => { 
                            handleClose();
                            setTempConfig(prevState => ({...prevState, amount: [...prevState.amount, false] }));
                        }}
                    >
                        Sui Input
                    </Button>
                </Box>
            </Popover>
            <Dialog 
                open={isOpenDialog}
                sx={{ pb: 10}}
            >
                <Stack spacing={3} sx={{ px: 5, py: 5 }}>
                    <TextField
                        type='number'
                        variant='outlined'
                        label='Sui Number'
                        placeholder='Example: 5'
                        focused
                        onChange={(event) =>
                        {
                            const value = event.target.value;
                            if (value) { setNewAmountSui(value); }
                        }}
                    />
                    <Button
                        variant='contained'
                        onClick={() => { 
                            setOpenDialog(false);
                            if (newAmountSui) {
                                setTempConfig(prevState => ({...prevState, amount: [...prevState.amount, newAmountSui] }));
                            }
                        }}
                    >
                        Save
                    </Button>
                </Stack>
            </Dialog>
        </Page>
    )
};