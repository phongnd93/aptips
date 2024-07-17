import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { APT_DONA_PATH } from '../../../routes/paths';

export default function Index()
{
    const { pathname, push } = useRouter();
    console.log(pathname);

    useEffect(() =>
    {
        if (pathname === APT_DONA_PATH.manager.root)
        {
            console.log(pathname);
            push(APT_DONA_PATH.manager.link);
        }
    }, [pathname]);

    return null;
};