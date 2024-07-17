import { createContext, useState } from "react";
import { LinkDonationModel, UserLinkDonateModel } from "src/@types/link-donation";
import { RevenueResponseDTO } from "src/@types/transaction";


import LinksServices from "src/services/LinksServices";


type LinkDonateProviderProps = {
    listLinks: LinkDonationModel[],
    listUserDonate: UserLinkDonateModel[],
    listMostDoante: LinkDonationModel[],
    linkId: number,
    totalUserDonate: number,
    totalSUI: number,
    newDonators: number,
    revenue: RevenueResponseDTO,

    setTotalSUI: (value: number) => void,
    setRevenue: (config: RevenueResponseDTO) => void,
    setListUserDonates: (config: UserLinkDonateModel[]) => void,
    setListMostDonate: (config: LinkDonationModel[]) => void,
    setLinkId: (value: number) => void,
    setTotalUserDonate: (value: number) => void,
    setNewDonators:(value: number) => void,
    setListLinks: (config: LinkDonationModel[]) => void,
    loadDataLink: (reques?: string) => Promise<any>,
    loadListUserDonate: (id: string) => Promise<any>,
    loadRevenue: (id: number) => Promise<any>,
};

const LinkDonateContext = createContext<LinkDonateProviderProps>({} as LinkDonateProviderProps);

const LinkDonateProvider: React.FC<{NodeId: string}> = ({ NodeId, children }) =>
{
    var linkSvc = new LinksServices()
    
    const [ listLinks, setListLinks ] = useState<LinkDonationModel[]>([])
    const [ listUserDonate, setListUserDonates ] = useState<UserLinkDonateModel[]>([])
    const [ listMostDoante, setListMostDonate ] = useState<LinkDonationModel[]>([])

    const [revenue, setRevenue] = useState<RevenueResponseDTO>([]);

    const [totalUserDonate , setTotalUserDonate] = useState<number>(0);
    const [totalSUI , setTotalSUI] = useState<number>(0);
    const [newDonators, setNewDonators] = useState<number>(0);

    const [ linkId, setLinkId ] = useState<number>(0);

    const loadDataLink = async(reques?: any) => {
        const result: any = await linkSvc.get();
  
        if (result.status === 200 )
        {
          setListLinks(result.data.data);
        }
    } 

    const loadListUserDonate = async(id: string) =>
    {
        const result = await linkSvc.getUserTransactionLink(id);

        if (result?.status === 200)
        {
            setListUserDonates(result.data);
            setTotalUserDonate(result.data?.totalDonate);
            setRevenue(result.data?.length);
            setTotalSUI(result.data?.totalSUI);
        }
    }

    const loadRevenue = async(id: number) =>
    {
        const result = await linkSvc.revenue(id);
        setRevenue(result)
    }

    return (
        <LinkDonateContext.Provider value={{
            listLinks,
            linkId,
            listUserDonate,
            listMostDoante,
            totalUserDonate,
            newDonators,
            revenue,
            totalSUI,

            setTotalSUI,
            setRevenue,
            setListUserDonates,
            setListMostDonate,
            setTotalUserDonate,
            setNewDonators,
            setLinkId,
            setListLinks,
            loadDataLink,
            loadListUserDonate,
            loadRevenue,
        }}
        >
            {children}
        </LinkDonateContext.Provider>
    )
}

export { LinkDonateProvider, LinkDonateContext  }