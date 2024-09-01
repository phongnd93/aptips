import { useContext } from "react";
import { ChainContext } from "../contexts/ChainContext";

const useChainAuth = () => {
    const context = useContext(ChainContext);
  
    if (!context) throw new Error('Auth context must be use inside AuthProvider');
  
    return context;
  };
  
  export default useChainAuth;