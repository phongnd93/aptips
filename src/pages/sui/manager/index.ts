import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { SUI_DONA_PATH } from '../../../routes/paths';

export default function Index()
{
    const { pathname, push } = useRouter();

    useEffect(() =>
    {
        if (pathname === SUI_DONA_PATH.manager.root)
        {
            push(SUI_DONA_PATH.manager.root);
        }
    }, [pathname]);

    return null;
};