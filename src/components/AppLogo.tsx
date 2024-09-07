import { forwardRef } from 'react';
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';
import React from 'react';

// ----------------------------------------------------------------------

interface Props extends BoxProps
{
    disabledLink?: boolean;
}

const AppLogo = forwardRef<any, Props>(({ disabledLink = false, sx }, ref) =>
{
    const theme = useTheme();
    const PRIMARY_LIGHT = theme.palette.primary.light;
    const PRIMARY_MAIN = theme.palette.primary.main;
    const PRIMARY_DARK = theme.palette.primary.dark;

    const logo = (
        <Box ref={ref} sx={{ width: 'fit-content', maxWidth: 120, height: 90, marginRight: theme.spacing(1), cursor: 'pointer', ...sx }}>
            <svg width="100%" height="100%" viewBox="0 0 158 66">
                <defs>
                    <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
                        <stop offset="0%" stopColor={PRIMARY_DARK} />
                        <stop offset="100%" stopColor={PRIMARY_MAIN} />
                    </linearGradient>
                    <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor={PRIMARY_LIGHT} />
                        <stop offset="100%" stopColor={PRIMARY_MAIN} />
                    </linearGradient>
                    <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
                        <stop offset="0%" stopColor={PRIMARY_LIGHT} />
                        <stop offset="100%" stopColor={PRIMARY_MAIN} />
                    </linearGradient>
                </defs>
                <g transform="matrix(2.5677602585287187,0,0,2.5677602585287187,0,0)" fill="url(#BG1)">
                    <path d="M0 10.66 l0 -4.68 l15.3 0 l0 4.68 l-3.76 0 l0 -1.56 l2.2 0 l0 -1.56 l-12.18 0 l0 1.56 l5.32 0 l-0.02 9.34 l1.56 0 l0 -9.34 l1.56 0 l0 10.9 l-4.68 0 l0 -9.34 l-5.3 0 z M22.78 20 l-4.68 0 l0 -14.02 l4.68 0 l0 10.9 l-1.56 0 l0 -9.34 l-1.56 0 l0 10.9 l3.12 0 l0 1.56 z M25.580000000000002 5.98 l11.42 0 c2.14 0 3.88 1.74 3.88 3.9 c0 2.14 -1.74 3.9 -3.88 3.9 l-9.86 -0.02 l0 4.68 l1.56 0 l0 -3.12 l1.54 0 l0 4.68 l-4.66 0 l0 -7.8 l11.42 0.02 c1.28 0 2.32 -1.06 2.32 -2.34 c0 -1.3 -1.04 -2.34 -2.32 -2.34 l-9.86 0 l0 1.56 l9.86 0 c0.4 0.02 0.74 0.36 0.74 0.78 s-0.32 0.76 -0.78 0.78 l-0.02 0 l-11.36 0 l0 -4.68 z" />
                </g>
                <g transform="matrix(0.6356204536882375,0,0,0.6356204536882375,101,0)" fill="url(#BG1)">
                    <path xmlns="http://www.w3.org/2000/svg" d="M50.468,79.688c3.308-0.008,4.781-0.357,4.781-0.357s-0.949-3.729-1.13-5.967s-0.284-3.404,0-6.465  c0.27-2.9,0.722-8.166,2.679-9.426c1.716-1.105,7.724-3.627,9.293-4.621s6.639-4.724,7.664-5.532  c1.026-0.808,6.64-5.097,8.209-7.023s2.232-2.486,3.198-4.351c0.966-1.864,1.569-4.91,1.569-6.278c0-1.367,0-4.351-0.423-5.407  c-0.422-1.057-0.543-1.305-1.388-1.181c-0.845,0.124-0.604-0.125-1.146,0.994c-0.544,1.119-1.026,2.921-1.992,3.419  c-0.966,0.497-11.226,1.678-15.028,3.356c-3.802,1.678-6.99,3.261-11.226,6.34c-3.078,2.237-5.491,6.34-5.491,6.34l-0.033-0.053  c0,0-2.382-4.049-5.459-6.287c-4.235-3.079-7.424-4.662-11.227-6.34c-3.802-1.678-14.062-2.859-15.027-3.356  c-0.967-0.498-1.449-2.3-1.992-3.419c-0.543-1.119-0.302-0.87-1.146-0.994c-0.846-0.125-0.966,0.124-1.389,1.181  c-0.422,1.057-0.422,4.04-0.422,5.407c0,1.368,0.604,4.414,1.568,6.278c0.966,1.865,1.63,2.424,3.199,4.351s7.183,6.215,8.208,7.023  c1.026,0.808,6.096,4.538,7.665,5.532s7.576,3.516,9.293,4.621c1.957,1.26,3.138,6.525,3.388,9.426c0.279,3.252,0.181,4.227,0,6.465  s-0.936,6.076-0.936,6.076S47.579,79.691,50.468,79.688z" />
                </g>
                <g transform="matrix(1,0,0,1,157,48)" fill="#122d42">
                    <path d="" />
                </g>
            </svg>

        </Box >
    );

    if (disabledLink)
    {
        return <>{logo}</>;
    }

    return <NextLink href="/dashboard">{logo}</NextLink>;
});

export default AppLogo;
