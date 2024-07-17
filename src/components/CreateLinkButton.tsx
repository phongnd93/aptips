import { Tooltip, IconButton, alpha, Stack, Button, Typography } from "@mui/material";
import Link from "next/link";
import Iconify from "./Iconify";
import { useTheme } from '@mui/material/styles';
import { SUI_DONA_PATH } from "src/routes/paths";

const CreateLinkButton: React.FC = () =>
{
    const theme = useTheme();
    return (
        <Stack direction="row" flexWrap="wrap" alignItems="center">
            <Link href={SUI_DONA_PATH.manager.form}>
                <Tooltip title={'Create Link Button'} placement="top">
                    <Button variant="contained">
                        <Iconify icon={'ant-design:qrcode'} sx={{ width: 20, height: 20, marginRight: theme.spacing(1) }} />
                        <Typography variant="button"> Create Link</Typography>
                    </Button>
                </Tooltip>
            </Link>
        </Stack>
    );
}

export default CreateLinkButton;