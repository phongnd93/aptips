import axios, { AxiosResponse } from "axios"
import { SuiUser } from "src/@types/sui-user"
import { API } from "src/config"

export default class UserServices
{
    add = async (data: SuiUser) =>
    {
        try
        {
            return await axios.post(`${API}/user`, data);
        } catch (error)
        {
            return {
                status: 500,
                statusText: error.message,
                data: null,
            };
        }
    }

    update = async (data: SuiUser) =>
    {
        try
        {
            return await axios.patch(`${API}/user/${data.id}`, data);
        } catch (error)
        {
            return {
                status: 500,
                statusText: error.message,
                data: null,
            };
        }
    }

    info = async (walletAddress: string) =>
    {
        try
        {
            return await axios.get(`${API}/user/${walletAddress}`);
        } catch (error)
        {
            return {
                status: 500,
                statusText: error.message,
                data: null,
            };
        }
    }

    transactions = async (userId: number) =>
    {
        try
        {
            return await axios.get(`${API}/transaction-history/transactions-by-user/${userId}`);
        } catch (error)
        {
            return {
                status: 500,
                statusText: error.message,
                data: null,
            };
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
            return {
                status: 500,
                statusText: error.message,
                data: null,
            };
        }
    }

}