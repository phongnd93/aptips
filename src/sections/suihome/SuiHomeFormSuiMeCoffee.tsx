import { m } from 'framer-motion';
// @mui
import { styled } from '@mui/material/styles';
import Image from "src/components/Image";
import { Card, CardContent, Container, OutlinedInput, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
// components
import { MotionViewport, varFade } from '../../components/animate';
import Iconify from 'src/components/Iconify';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(15),
    backgroundColor: theme.palette.background.default
}));

// ----------------------------------------------------------------------
const AmountToggleButton = styled(ToggleButton)(({ theme }) => ({
    "&.Mui-selected, &.Mui-selected:hover": {
        color: "white",
        backgroundColor: theme.palette.primary.main
    }
}));
export default function SuiHomeFormSuiMeCoffee()
{
    const amounts = [1, 3, 5, false];
    return (
        <RootStyle>
            <Container component={MotionViewport} maxWidth={'sm'} textAlign={'center'}>
                <Stack spacing={0} alignItems={'center'}>
                    <m.div variants={varFade().inDown} style={{ width: '100%' }}>
                        <Card>
                            <CardContent>
                                <Stack spacing={2} alignSelf={'center'} alignItems={'center'}>
                                    <Stack>
                                        <Typography variant="h4">Donate for my podcast</Typography>
                                        <Typography variant="body1">Enjoy my podcast</Typography>
                                    </Stack>
                                    <Typography variant='h6'>Donation amount</Typography>
                                    <Stack
                                        direction={'row'}
                                        justifyContent={'center'}
                                        alignItems={'center'}
                                        bgcolor={(theme) => theme.palette.background.neutral}
                                        borderRadius={'0.25rem'}
                                        padding={3}
                                        gap={2}
                                        width={'100%'}
                                    >
                                        <Iconify icon={'token:aptos'} width={40} height={40} />
                                        <Iconify icon={'eva:close-fill'} width={16} height={16} />
                                        {amounts.map((a: any, index: number) => (
                                            <ToggleButtonGroup
                                                color="primary"
                                                exclusive
                                                disabled
                                                aria-label="Platform">
                                                {(a && typeof a === 'number')
                                                    ? (
                                                        <AmountToggleButton
                                                            className='form-donation-toggle-button'
                                                            sx={[
                                                                {
                                                                    borderRadius: '50%',
                                                                    width: 40,
                                                                    height: 40,
                                                                    border: 0
                                                                }
                                                            ]}
                                                            value={a}
                                                        >
                                                            {a}
                                                        </AmountToggleButton>
                                                    )
                                                    : (
                                                        <OutlinedInput
                                                            type='number'
                                                            size='small'
                                                            placeholder='Any APT'
                                                            sx={{ width: 120, borderRadius: 1 }}
                                                            disabled
                                                        />
                                                    )
                                                }
                                            </ToggleButtonGroup>
                                        ))}
                                    </Stack>
                                    <TextField
                                        color='info'
                                        label='Name'
                                        fullWidth
                                        disabled
                                    />
                                    <TextField
                                        color='info'
                                        rows={3}
                                        placeholder='Say something nice...(optional)'
                                        fullWidth
                                        multiline
                                        disabled
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </m.div>
                </Stack>
            </Container>
        </RootStyle>
    );
}
