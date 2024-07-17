import { styled } from "@mui/material";
import Page from "src/components/Page";
import Layout from "src/layouts";
import SuiHomeFund from 'src/sections/suihome/SuiHomeFund';
import SuiHomeFormSuiMeCoffee from 'src/sections/suihome/SuiHomeFormSuiMeCoffee';
import SuiHomeSayThanks from 'src/sections/suihome/SuiHomeSayThanks';
import SuiHomeDecentralizedTipping from 'src/sections/suihome/SuiHomeDecentralizedTipping';

const RootStyle = styled('div')(() => ({
    height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: theme.palette.background.default,
}));

HomePage.getLayout = function getLayout(page: React.ReactElement)
{
    return <Layout variant="landingPage">{page}</Layout>;
};

export default function HomePage()
{
    return (
        <Page title="Home">
            <RootStyle>
                <ContentStyle>
                    <SuiHomeFund />
                    <SuiHomeFormSuiMeCoffee />
                    <SuiHomeSayThanks />
                    <SuiHomeDecentralizedTipping />
                </ContentStyle>
            </RootStyle>
        </Page>
    );
}