import { Router, useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";
import { APIResponse } from "src/@types/dto/api-response";
import { AddFormConfig, FormConfigResponse } from "src/@types/dto/form-config-dto";
import useSuiAuth from "src/hooks/useSuiAuth";
import { SUI_DONA_PATH } from "src/routes/paths";
import FormConfigServices from "src/services/FormConfigServices";
import { makeid } from "src/utils/makeid";

export type TempConfig = {
    title?: string,
    subtitles?: string,
    amounts: (number | boolean)[],
    code: string,
}

interface FormConfigContextType
{
    data: FormConfigResponse | undefined,
    tempConfig: TempConfig,
    setTempConfig: React.Dispatch<React.SetStateAction<TempConfig>>,
    _fetchConfig: (id: string) => Promise<APIResponse>,
    _fetchConfigByCode: (string: string) => Promise<APIResponse>,
    _addConfig: (obj: AddFormConfig) => Promise<boolean | APIResponse>,
    _updateConfig: (obj: FormConfigResponse) => Promise<boolean | APIResponse>,
    handleSaveConfig: () => Promise<void>,
}

const FormConfigContext = createContext<FormConfigContextType>({} as FormConfigContextType);

const FormConfigProvider: React.FC = ({ children }) =>
{
    const router = useRouter();
    const formCogSvc = new FormConfigServices();
    const initTempConfig: TempConfig = {
        title: '',
        subtitles: '',
        amounts: [1, 3, 5, false],
        code: '',
    };

    const [data, setData] = useState<FormConfigResponse>();
    const [tempConfig, setTempConfig] = useState<TempConfig>(initTempConfig);
    const [linkCode, setLinkCode] = useState<string>('')

    const { info } = useSuiAuth();

    const handleGenerateLinkCode = () =>
    {
        if (typeof window !== 'undefined')
        {
            const code = makeid(10);
            const { protocol, hostname, port } = window.location;
            const link = `${protocol}//${hostname}${(hostname === 'localhost' && port) ? `:${port}` : ''}/donation/${code}`;
            setLinkCode(link);
            setTempConfig(prevState => ({ ...prevState, code: code }));
            setLinkCode(code);
        }
    }

    const handleSaveConfig = async () =>
    {
        if (!data && tempConfig && info?.id)
        {
            const data: AddFormConfig = {
                userId: info.id,
                name: '',
                amount: 0,
                linkCode: linkCode,
                receivedAddress: info.walletAddress,
                config: typeof tempConfig !== 'string' ? JSON.stringify(tempConfig) : tempConfig
            }
            await _addConfig(data);
        }
        else
        {
            if (data && data.id)
            {
                const newData: FormConfigResponse = {
                    ...data, ...{
                        config: {
                            title: tempConfig.title,
                            subtitles: tempConfig.subtitles,
                            amounts: tempConfig.amounts,
                            code: data.config.code,
                        }
                    }
                }

                if (newData && typeof newData.config === 'object')
                {
                    newData.config = JSON.stringify(newData.config)
                }
                await _updateConfig(newData);
            }
        }
    }

    const _fetchConfig = async (id: string) =>
    {
        const res = await formCogSvc.getById(id);
        if (res?.data)
        {
            if (res.data.config && typeof res.data.config !== 'object')
            {
                try
                {
                    res.data.config = JSON.parse(res.data.config);
                }
                catch {
                    res.data.config = res.data.config;
                }
            }
            setData(res.data);
        }
        return res;
    }

    const _fetchConfigByCode = async (code: string) =>
    {
        const res = await formCogSvc.getByLinkCode(code);
        if (res?.data)
        {
            if (res.data.config && typeof res.data.config !== 'object')
            {
                try
                {
                    res.data.config = JSON.parse(res.data.config);
                }
                catch {
                    res.data.config = res.data.config;
                }
            }
            setData(res.data);
        }
        return res;
    }

    const _addConfig = async (obj: AddFormConfig) =>
    {
        const res = await formCogSvc.add(obj);
        if (res?.data && res?.status === 200)
        {
            return router.push(`${SUI_DONA_PATH.manager.detail}/${res.data.data.id}`);
        }
        return res;
    }

    const _updateConfig = async (obj: FormConfigResponse) =>
    {
        const res = await formCogSvc.update(obj);
        if (res?.data && res?.status === 200)
        {
            return router.push(`${SUI_DONA_PATH.manager.detail}/${res.data.data.id}`);
        }
        return res;
    }

    useEffect(() =>
    {
        handleGenerateLinkCode();
    }, [])

    return (
        <FormConfigContext.Provider value={{
            data,
            tempConfig,
            setTempConfig,
            handleSaveConfig,
            _fetchConfig,
            _fetchConfigByCode,
            _addConfig,
            _updateConfig,
        }}>
            {children}
        </FormConfigContext.Provider>
    );
}

export { FormConfigProvider, FormConfigContext };
