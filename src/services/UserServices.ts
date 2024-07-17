import axios, { AxiosResponse } from "axios"
import { APIResponse, APIResponseObject } from "src/@types/dto/api-response"
import { SuiUser } from "src/@types/sui-user"
import { API } from "src/config"

export default class UserServices
{
    add = async (data: SuiUser): Promise<APIResponse> =>
    {
        try
        {
            return APIResponseObject(200, await axios.post(`${API}/user`, data));
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    update = async (data: SuiUser) =>
    {
        try
        {
            return APIResponseObject(200, await axios.patch(`${API}/user/${data.id}`, data));
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    info = async (walletAddress: string) =>
    {
        try
        {
            return await axios.get(`${API}/user/wallet/${walletAddress}`);
        } catch (error)
        {
            console.log('userSvc', error)
            return APIResponseObject(500, null, error.message);
        }
    }

    transactions = async (userId: number) =>
    {
        try
        {
            return await axios.get(`${API}/transaction-history/transactions-by-user/${userId}`);
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    donation = async (userId: number) =>
    {
        const donationInfos = ['value', 'num'];
        try
        {
            const res = await Promise.allSettled(donationInfos.map(di => axios.get(`${API}/user/donate-all-time/${di}/${userId}`)));
            return res.map(r => r.value);
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

}