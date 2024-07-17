import { useContext } from 'react';
import { AptosContext } from 'src/contexts/aptos/AptosContext';

const useAptos = () =>
{
    const context = useContext(AptosContext);

    if (!context) throw new Error('Auth context must be use inside AuthProvider');

    return context;
};

export default useAptos;
