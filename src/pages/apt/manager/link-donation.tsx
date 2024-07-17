import Layout from '../../../layouts';
import Page from '../../../components/Page';
import { Box, Card, CardContent, CardHeader, Container, Stack, Typography } from '@mui/material';
import useSettings from 'src/hooks/useSettings';

import TableLinkDonate from './table-link-donation/TableLinkDonate';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';

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
                <Box sx={{ mb: 1, pl: 1 }} >
                    <Stack spacing={2} direction={'row'}>
                        <HeaderBreadcrumbs
                            heading='List Link Donate'
                            links={[
                                { name: 'List Links' },
                            ]}
                        />
                    </Stack>
                </Box>
                <Stack>
                    <Card>
                        <CardContent>
                            <TableLinkDonate />
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
        </Page>
    )
};