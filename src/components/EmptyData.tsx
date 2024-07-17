import { Box, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CreateLinkButton from "./CreateLinkButton";

const EmptyDataContainerStyle = styled(Stack)(({ theme }) => ({
    left: 0,
    top: 0,
    zIndex: 10,
    position: 'absolute',
    width: '100%',
    height: '100%',
    paddingY: theme.spacing(5),
    paddingX: theme.spacing(5)
}));

const EmptyData: React.FC = () =>
{
    return <EmptyDataContainerStyle justifyContent={'center'} alignContent={'center'} alignItems={"center"}>
        <Box className={'background'} sx={{ opacity: 0.7, background: (theme) => theme.palette.background.default }} width={'100%'} height={'100%'}></Box>
        <Stack sx={{ position: 'absolute' }} justifyContent={'center'} alignContent={'center'} alignItems={"center"} spacing={2}>
            <Typography variant="h5">Create your own QRCode to get your first donation</Typography>
            <CreateLinkButton />
        </Stack>
    </EmptyDataContainerStyle>
}

export default EmptyData;