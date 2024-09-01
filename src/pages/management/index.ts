import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { APP_PATH } from '../../routes/paths';

export default function Index()
{
    const { pathname, push } = useRouter();
    console.log(pathname);

    useEffect(() =>
    {
        if (pathname === APP_PATH.manager.root)
        {
            push(APP_PATH.manager.link);
        }
    }, [pathname]);

    return null;
};