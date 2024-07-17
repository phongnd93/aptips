import axios, { AxiosResponse } from "axios"
import { APIResponse, APIResponseObject } from "src/@types/dto/api-response"
import { SuiUser } from "src/@types/sui-user"
import { API } from "src/config"

export default class LinksServices
{
    get = async (): Promise<APIResponse> =>
    {
        try
        {
            return APIResponseObject(200, await axios.get(`${API}/link`));
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

    getMostUserDonate = async (): Promise<APIResponse> =>
    {
        try
        {
            return APIResponseObject(200, await axios.get(`${API}/link/most-5-donated`))
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

}