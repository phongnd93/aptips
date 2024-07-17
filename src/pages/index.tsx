// @mui
import { styled } from '@mui/material/styles';
// layouts
import Layout from '../layouts';
import { Page } from '@react-pdf/renderer';
import { HomeHero, HomeMinimal, HomeHugePackElements, HomeDarkMode, HomeColorPresets, HomeCleanInterfaces, HomePricingPlans, HomeLookingFor, HomeAdvertisement } from 'src/sections/home';
// components
// sections

// ----------------------------------------------------------------------

const RootStyle = styled('div')(() => ({
  height: '100%',
}));

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default,
}));

// ----------------------------------------------------------------------

HomePage.getLayout = function getLayout(page: React.ReactElement)
{
  return <Layout variant="main">{page}</Layout>;
};

// ----------------------------------------------------------------------

export default function HomePage()
{
  return (
    <Page title="The starting point for your next project">
      <RootStyle>
        {/* <HomeHero /> */}
        <ContentStyle>
          <HomeMinimal />

          <HomeHugePackElements />

          <HomeDarkMode />

          <HomeColorPresets />

          <HomeCleanInterfaces />

          <HomePricingPlans />

          <HomeLookingFor />

          <HomeAdvertisement />
        </ContentStyle>
      </RootStyle>
    </Page>
  );
}

