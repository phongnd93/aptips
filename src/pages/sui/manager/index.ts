import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SUI_DONA_PATH } from '../../../routes/paths';

export default function Index()
{
    const { pathname, push } = useRouter();
    console.log(pathname);

    useEffect(() =>
    {
        if (pathname === SUI_DONA_PATH.manager.root)
        {
            console.log(pathname);
            push(SUI_DONA_PATH.manager.link);
        }
    }, [pathname]);

    return null;
};