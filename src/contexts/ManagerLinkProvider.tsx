import { createContext, useState } from "react";
import { LinkDonationModel, UserLinkDonateModel } from "src/@types/link-donation";
import LinksServices from "src/services/LinksServices";



type LinkDonateProviderProps = {
    listLinks: LinkDonationModel[],
    listUserDonate: UserLinkDonateModel[],
    listMostDoante: LinkDonationModel[],
    linkId: number,


    setListUserDonates: (config: UserLinkDonateModel[]) => void,
    setListMostDonate: (config: LinkDonationModel[]) => void,
    setLinkId: (value: number) => void,
    setListLinks: (config: LinkDonationModel[]) => void,
    loadDataLink: (reques?: string) => Promise<any>,
    loadListUserDonate: (id: number) => Promise<any>,
    loadListMostDonate: (reques?: string) => Promise<any>,
};

const LinkDonateContext = createContext<LinkDonateProviderProps>({} as LinkDonateProviderProps);

const LinkDonateProvider: React.FC<{NodeId: string}> = ({ NodeId, children }) =>
{
    var linkSvc = new LinksServices()
    
    const [ listLinks, setListLinks ] = useState<LinkDonationModel[]>([])
    const [ listUserDonate, setListUserDonates ] = useState<UserLinkDonateModel[]>([])
    const [ listMostDoante, setListMostDonate ] = useState<LinkDonationModel[]>([])


    const [ linkId, setLinkId ] = useState<number>(0);

    const loadDataLink = async(reques?: any) => {
        const result: any = await linkSvc.get();
  
        if (result.status === 200 )
        {
          setListLinks(result.data.data);
        }
    } 

    const loadListUserDonate = async(id: number) =>
    {
        const value = JSON.stringify(id);
        const result = await linkSvc.getUserDonateLink(value);

        if (result?.status === 200)
        {
            setListUserDonates(result.data);
        }
    }

    const loadListMostDonate = async() =>
    {
        const result = await linkSvc.getMostUserDonate();

        if (result?.status === 200)
        {
            setListMostDonate(result.data);
        }
    }

    return (
        <LinkDonateContext.Provider value={{
            listLinks,
            linkId,
            listUserDonate,
            listMostDoante,

            setListUserDonates,
            setListMostDonate,
            setLinkId,
            setListLinks,
            loadDataLink,
            loadListUserDonate,
            loadListMostDonate,
        }}
        >
            {children}
        </LinkDonateContext.Provider>
    )
}

export { LinkDonateProvider, LinkDonateContext  }