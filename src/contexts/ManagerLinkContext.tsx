import { createContext, useState } from "react";
import { LinkDonationModel } from "src/@types/link-donation";
import { RevenueResponseDTO, Transaction } from "src/@types/transaction";


import LinksServices from "src/services/LinksServices";


type LinkDonateProviderProps = {
    listLinks: LinkDonationModel[],
    listUserDonate: Transaction[],
    listMostDoante: LinkDonationModel[],
    revenue: RevenueResponseDTO,

    setRevenue: (config: RevenueResponseDTO) => void,
    setListUserDonates: (config: Transaction[]) => void,
    setListMostDonate: (config: LinkDonationModel[]) => void,
    setListLinks: (config: LinkDonationModel[]) => void,
    loadDataLink: (id?: number) => Promise<any>,
    loadDetailLink: (id: string) => Promise<any>,
    loadListUserDonate: (id: string) => Promise<any>,
    loadRevenue: (id: number) => Promise<any>,
};

const LinkDonateContext = createContext<LinkDonateProviderProps>({} as LinkDonateProviderProps);

const LinkDonateProvider: React.FC<{NodeId: string}> = ({ NodeId, children }) =>
{
    var linkSvc = new LinksServices()
    
    const [ listLinks, setListLinks ] = useState<LinkDonationModel[]>([])
    const [ listUserDonate, setListUserDonates ] = useState<Transaction[]>([])
    const [ listMostDoante, setListMostDonate ] = useState<LinkDonationModel[]>([])

    const [revenue, setRevenue] = useState<RevenueResponseDTO>([]);

    const loadDataLink = async(id?: number) => {
        const result: any = await linkSvc.getLinkByUser(id);
  
        if (result.status === 200 )
        {
          setListLinks(result.data.data);
        }
    } 

    const loadDetailLink = async(id: string) => {
        const result: any = await linkSvc.getLinkById(id)
        if (result.status === 200 )
        {
            return result;
        }
    }

    const loadListUserDonate = async(id: string) =>
    {
        const result = await linkSvc.getUserTransactionLink(id);

        if (result?.status === 200)
        {
            setListUserDonates(result.data.data);
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
            listUserDonate,
            listMostDoante,
            revenue,

            setRevenue,
            setListUserDonates,
            setListMostDonate,
            setListLinks,
            loadDetailLink,
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