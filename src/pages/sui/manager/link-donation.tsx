import Layout from '../../../layouts';
import Page from '../../../components/Page';
import { Card, CardContent, CardHeader, Container, Stack, Typography } from '@mui/material';
import useSettings from 'src/hooks/useSettings';

import TableLinkDonate from './table-link-donation/TableLinkDonate';
import EmptyData from 'src/components/EmptyData';
// import EmptyPage from 'src/components/empty-page/EmptyPage';
// ----------------------------------------------------------------------

ManagerLinkDonation.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout>{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function ManagerLinkDonation()
{
    const { themeStretch } = useSettings();

    return (
        <Page title="Manager: Link Donation" sx={{ mt: 4 }}>

            <Container maxWidth={themeStretch ? false : 'lg'} sx={{ mt: 10, mb: 10 }}>
                <Typography variant="h4" sx={{ display: 'flex', mb: 3 }}>
                    Detail Link Donate
                </Typography>
                <Stack>
                    <Card>
                        <CardContent>
                            <TableLinkDonate />
                            <EmptyData />
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
        </Page>
    )
};