import axios, { AxiosResponse } from "axios"
import { DonateFormConfig } from "src/@types/form-config"
import { APIResponse, APIResponseObject } from "src/@types/dto/api-response"
import { API } from "src/config"

export default class ConfigServices
{
    getById = async (id: string): Promise<APIResponse> =>
    {
        try
        {
            return await axios.get(`${API}/link/${id}`);
        }
        catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    getByLinkCode = async (linkCode: string): Promise<APIResponse> =>
    {
        try
        {
            return await axios.get(`${API}/link/link-by-link-code/${linkCode}`);
        }
        catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }
    
    add = async (data: DonateFormConfig): Promise<APIResponse> =>
    {
        try
        {
            return APIResponseObject(200, await axios.post(`${API}/link`, data));
        }
        catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }

    update = async (data: DonateFormConfig) =>
    {
        try
        {
            return APIResponseObject(200, await axios.patch(`${API}/link/${data.id}`, data));
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }
}