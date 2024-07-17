import axios, { AxiosResponse } from "axios"
import { APIResponse, APIResponseObject } from "src/@types/dto/api-response"
import { SuiUser } from "src/@types/sui-user"
import { API } from "src/config"

export default class UserServices
{
    add = async (data: SuiUser) =>
    {
        try
        {
            const res = await axios.post(`${API}/user`, data);
            return APIResponseObject(200, res.data);
        } catch (error)
        {
            console.log('UserSvc.add', error);
            // return APIResponseObject(500, null, error.message);
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
            console.log('UserSvc.update', error);
            // return APIResponseObject(500, null, error.message);
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
            console.log('UserSvc.info', error);
            // return APIResponseObject(500, null, error.message);
        }
    }

    infoById = async (id: number) =>
    {
        try
        {
            const res = await axios.get(`${API}/user/${id}`);
            return APIResponseObject(200, res.data);
        } catch (error)
        {
            console.log('UserSvc.info', error);
            // return APIResponseObject(500, null, error.message);
        }
    }

    donation = async (userId: number): Promise<APIResponse> =>
    {
        const donationInfos = ['value', 'num'];
        const res: { value: number, num: number } = {
            value: 0,
            num: 0
        };
        try
        {
            const [value, num] = await Promise.allSettled(donationInfos.map(di => axios.get(`${API}/user/donate-all-time/${di}/${userId}`)));
            if (value?.status === 'fulfilled') res.value = value.value.data;
            if (num?.status === 'fulfilled') res.num = num.value.data;
        } catch (error)
        {
            console.log('UserSvc.donation', error);
            // return APIResponseObject(500, null, error.message);
        }
        return APIResponseObject(200, res);
    }



}