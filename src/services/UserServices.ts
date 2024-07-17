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
            const res = await axios.post(`${API}/user`, data);
            return APIResponseObject(200, res.data);
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    update = async (data: SuiUser) =>
    {
        try
        {
            const res = await axios.patch(`${API}/user/${data.id}`, data);
            return APIResponseObject(200, res.data);
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    info = async (walletAddress: string) =>
    {
        try
        {
            const res = await axios.get(`${API}/user/wallet/${walletAddress}`);
            return APIResponseObject(200, res.data);
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
            const res = await axios.get(`${API}/transaction-history/transactions-by-user/${userId}`)
            return APIResponseObject(200, res.data);
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
            console.log('donation', res);
            return res.map(r => r.value);
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

}