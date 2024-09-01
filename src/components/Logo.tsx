import { forwardRef } from 'react';
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, BoxProps } from '@mui/material';

// ----------------------------------------------------------------------

interface Props extends BoxProps
{
  disabledLink?: boolean;
}

const Logo = forwardRef<any, Props>(({ disabledLink = false, sx }, ref) =>
{
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;
  const PRIMARY_DARK = theme.palette.primary.dark;

  const logo = (
    <Box ref={ref} sx={{ width: 90, height: 90, marginRight: theme.spacing(1), cursor: 'pointer', ...sx }}>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.0" width="100%" height="100%" viewBox="0 0 450 320">
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
        <path xmlns="http://www.w3.org/2000/svg" fill="url(#BG3)" d="M236.8,268.3,68,42.5h-23.6v244.2h23.6V42.5ZM274.1,141.6c-11.6-11.6-11.6-30.5,0-42l36.9-36.9h60.6l-81.1,81.1,14.3,14.3,115.6-115.6h-206.8l-83.2,83.2V42.5h-23.6v244.2h23.6v-82l82,82h206.7l-144.9-145ZM170.7,174.4s0,0,0,0c-1.1,1.1-2.1,2.3-3.1,3.5-.3.3-.5.7-.8,1-.7.9-1.4,1.9-2.1,2.9-.2.3-.4.6-.6,1-.7,1.1-1.4,2.3-2.1,3.5,0,.1-.2.3-.2.4-2.2,4.2-3.8,8.7-4.7,13.4,0,.1,0,.2,0,.4-.1.7-.3,1.3-.4,2l-16.2-16.2c-5.6-5.6-8.7-13.1-8.7-21s3.1-15.4,8.7-21l81.5-81.5h60.6l-111.8,111.8h0ZM220.7,266.5s-37.1-37.2-37.7-38c0,0-.1-.2-.2-.3-8-10-8.6-24.1-1.7-34.7,0,0,0-.1,0-.2.5-.7,1-1.3,1.5-2,.1-.1.2-.3.3-.4.6-.7,1.3-1.5,1.9-2.1,0,0,0,0,0,0l16.2-16.2c0,.5.2,1,.3,1.5,0,.5.2,1.1.3,1.6.2,1.1.5,2.1.8,3.1.1.4.2.8.3,1.2.4,1.4.9,2.8,1.5,4.2.1.3.3.6.4.9.5,1.1,1,2.1,1.5,3.1.2.5.5.9.8,1.4.5.9,1,1.7,1.5,2.6.3.5.6.9.9,1.4.6.9,1.2,1.7,1.9,2.5.3.4.6.8.9,1.1,1,1.2,2,2.3,3.1,3.4l66,66h-60.6ZM229.5,186.2c-5.6-5.6-8.7-13.1-8.7-21s3.1-15.4,8.7-21l16.3-16.2c1.5,10.2,6.2,20.1,14.1,28l110.5,110.6h-60.5l-80.3-80.3Z" />
      </svg>

      {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
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
        <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
          <path
            fill="url(#BG1)"
            d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z"
          />
          <path
            fill="url(#BG2)"
            d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994"
          />
          <path
            fill="url(#BG3)"
            d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48"
          />
        </g>
      </svg> */}
    </Box>
  );

  if (disabledLink)
  {
    return <>{logo}</>;
  }

  return <NextLink href="/dashboard">{logo}</NextLink>;
});

export default Logo;
