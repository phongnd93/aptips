import { useContext, useEffect } from 'react';
import { FormConfigContext, FormConfigProvider } from 'src/contexts/FormConfigContext';
import { Button, Card, CardContent, Container, Stack } from '@mui/material';
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs';
import { FormConfig } from 'src/components/form/FormConfig';
import { APT_DONA_PATH } from 'src/routes/paths';
import { styled } from '@mui/material/styles';
import Page from 'src/components/Page';
import Layout from 'src/layouts';
import React from 'react';
import { useRouter } from 'next/router';

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    paddingBottom: theme.spacing(5),
}));

interface ManagerFormDonationProps
{
}

const ManagerFormDonationComponent: React.FC<ManagerFormDonationProps> = (props: ManagerFormDonationProps) =>
{
    const { handleSaveConfig, _fetchConfig, setTempConfig, initTempConfig } = useContext(FormConfigContext);
    const router = useRouter();
    useEffect(() =>
    {
        setTempConfig(initTempConfig);
        const { id } = router.query;
        setTempConfig(initTempConfig);
        if (id)
        {
            _fetchConfig(id as string).then(result =>
            {
                if (result?.data?.config)
                {
                    setTempConfig(result.data.config);
                }
            });
        }
    }, [router.query.id]);
    return (
        <Page title="Manager: Form Donation">
            <RootStyle>
                <Container>
                    <Stack spacing={1} direction={'row'}>
                        <HeaderBreadcrumbs
                            heading='Manager Form Donation'
                            links={[
                                { name: 'Manager', href: APT_DONA_PATH.manager.root },
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

export default function ManagerFormDonation(props: ManagerFormDonationProps)
{


    return (
        <Layout>
            <FormConfigProvider>
                <ManagerFormDonationComponent {...props} />
            </FormConfigProvider>
        </Layout >
    )
}