import axios, { AxiosResponse } from "axios"
import { APIResponse, APIResponseObject } from "src/@types/dto/api-response"
import { SuiUser } from "src/@types/sui-user"
import { API } from "src/config"
import { RevenueResponseDTO } from "src/@types/transaction"

export default class LinksServices
{
    getLinkByUser = async (id?: number): Promise<APIResponse> =>
    {
        try
        {
            // ${API}/link/users-donate/${user}/${id
            return APIResponseObject(200, await axios.get(`${API}/link/link-by-user/${id}`));
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    getLinkById  = async (id: string):  Promise<APIResponse> =>
    {
        try
        {
            return APIResponseObject(200, await axios.get(`${API}/link/${id}`))
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    getUserDonateLink = async (id: string): Promise<APIResponse> =>
    {
        try
        {
            return APIResponseObject(200, await axios.get(`${API}/link/users-donate/${id}`))
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    getUserTransactionLink = async (id: string): Promise<APIResponse> =>
    {
        try
        {
            return APIResponseObject(200, await axios.get(`${API}/transaction-history/transactions-by-link/${id}`))
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    revenue = async (id: number) =>
    {
        try
        {
            const res = await axios.get(`${API}/transaction-history/month-revenue-of-source/${id}`);
            if (res?.data)
                return res.data as RevenueResponseDTO;
        } catch (error)
        {
            console.log('TransactionServices.revenue', error);
        }

        return [] as RevenueResponseDTO;
    }

}