import { useContext } from 'react';
import { SuiAuthContext } from 'src/contexts/SuiAuthContext';
//
// import { AuthContext } from '../contexts/JWTContext';
// import { AuthContext } from '../contexts/Auth0Context';
// import { AuthContext } from '../contexts/FirebaseContext';
// import { AuthContext } from '../contexts/AwsCognitoContext';

// ----------------------------------------------------------------------

const useSuiAuth = () =>
{
    const context = useContext(SuiAuthContext);

    if (!context) throw new Error('Auth context must be use inside AuthProvider');

    return context;
};

export default useSuiAuth;
