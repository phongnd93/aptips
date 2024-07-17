import { createContext } from "react";
import { Source } from "src/@types/source";


import SourceServices from "src/services/SourceServices";


type SourceProviderProps = {
    add: (data: Source) => Promise<Source | null>,
};

const SourceContext = createContext<SourceProviderProps>({} as SourceProviderProps);

const SourceProvider: React.FC = ({ children }) =>
{
    var sourceSvc = new SourceServices()

    const add = async (data: Source) =>
    {
        return await sourceSvc.add(data);
    }

    return (
        <SourceContext.Provider value={{
            add
        }}
        >
            {children}
        </SourceContext.Provider>
    )
}

export { SourceProvider, SourceContext }