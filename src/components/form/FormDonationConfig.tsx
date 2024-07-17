import React, { Dispatch, SetStateAction, useState } from 'react';
import { Badge, Box, Button, Dialog, Grid, InputAdornment, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import SvgIconStyle from '../SvgIconStyle';
import Iconify from '../Iconify';
import { FabButtonAnimate } from '../animate';
import { IconButton } from '@mui/material';
import { ToggleButton } from '@mui/material';
import { Popover } from '@mui/material';

interface FormDonationConfigProps {
    tempConfig: Record<string, any>,
    setTempConfig: Dispatch<SetStateAction<Record<string, any>>>
}

export const FormDonationConfig: React.FC<FormDonationConfigProps> = (props: FormDonationConfigProps) =>
{
    const { tempConfig, setTempConfig } = props;

    const [newAmountSui, setNewAmountSui] = useState('');
    const [isOpenDialog, setOpenDialog] = useState(false);
    const [isOpen, setOpen] = useState<null | HTMLElement>(null);

    const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
           <Stack spacing={5}>
                <Stack spacing={1}>
                    <OutlinedInput
                        size='small'
                        placeholder='Title'
                        color='info'
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
                        color='info'
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
                </Stack>
                <Grid container>
                    <Grid item xs={12}>
                        <Stack
                            spacing={2}
                            alignItems={'center'}
                        >
                            <Typography variant='h6'>Donation amount</Typography>
                            <Stack
                                direction={'row'}
                                justifyContent={'center'}
                                alignItems={'center'}
                                bgcolor={'#D0F2FF'}
                                borderRadius={'0.25rem'}
                                padding={3}
                                gap={2}
                                width={'100%'}
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
                            </Stack>
                            <TextField
                                color='info'
                                label='Name'
                                fullWidth
                            />
                            <TextField
                                color='info'
                                rows={3}
                                placeholder='Say something nice...(optional)'
                                fullWidth
                                multiline
                            />
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
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
                        color='info'
                        sx={{ width: 100 }}
                        onClick={() => { 
                            handleClose();
                            setOpenDialog(true); 
                        }}
                    >
                        Sui Number
                    </Button>
                    <Button
                        color='info'
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
                        color='info'
                        focused
                        onChange={(event) =>
                        {
                            const value = event.target.value;
                            if (value) { setNewAmountSui(value); }
                        }}
                    />
                    <Button
                        variant='contained'
                        color='info'
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
        </>
    );
}