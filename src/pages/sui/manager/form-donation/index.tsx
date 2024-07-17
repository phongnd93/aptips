import { useContext, useEffect } from 'react';
import { FormConfigContext, FormConfigProvider } from 'src/contexts/FormConfigContext';
import { Button, Card, CardContent, Container, Stack } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { FormConfig } from 'src/components/form/FormConfig';
import { SUI_DONA_PATH } from 'src/routes/paths';
import { styled } from '@mui/material/styles';
import Page from 'src/components/Page';
import Layout from 'src/layouts';
import { useRouter } from 'next/router';
import React from 'react';

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(5),
}));

interface ManagerFormDonationProps
{
}

const ManagerFormDonationComponent: React.FC<ManagerFormDonationProps> = (props: ManagerFormDonationProps) =>
{
    const { handleSaveConfig, _fetchConfig, data, setTempConfig } = useContext(FormConfigContext);

    const router = useRouter();

    useEffect(() =>
    {
        const { id } = router.query;
        if (id)
        {
            _fetchConfig(id as string);
        }
    }, [router.query.id]);

    useEffect(() =>
    {
        if (data)
        {
            setTempConfig(data.config)
        }
    }, [data])

    return (
        <Page title="Manager: Form Donation">
            <RootStyle>
                <Container>
                    <Stack spacing={1} direction={'row'}>
                        <HeaderBreadcrumbs
                            heading='Manager Form Donation'
                            links={[
                                { name: 'Manager', href: SUI_DONA_PATH.manager.root },
                                { name: 'Manager Form Donation' },
                            ]}
                        />
                    </Stack>
                </Container>
            </RootStyle>
            <Container sx={{ mt: 5, mb: 5 }}>
                <Stack alignItems={'center'}>
                    <Card sx={{ maxWidth: 600 }}>
                        <CardContent>
                            <Stack spacing={3}>
                                <FormConfig />
                                <Button
                                    variant='contained'
                                    type='button'
                                    onClick={handleSaveConfig}
                                >
                                    Submit
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>
            </Container>
        </Page>
    );
};

const ManagerFormDonation: React.FC<ManagerFormDonationProps> = (props: ManagerFormDonationProps) =>
{
    return (
        <Layout>
            <FormConfigProvider>
                <ManagerFormDonationComponent {...props} />
            </FormConfigProvider>
        </Layout>
    )
}
export default ManagerFormDonation;