import axios from "axios";
import { APIResponse, APIResponseObject } from "src/@types/dto/api-response";
import { API } from "src/config";

export default class FaucetServices
{
    getTokens = async (account: string, chainId: string): Promise<APIResponse> =>
    {
        try
        {
            // ${API}/link/users-donate/${user}/${id
            return APIResponseObject(200, await axios.get(`${API}/tokens`, { params: { account, chainId } }));
        } catch (error)
        {
            return APIResponseObject(500, null, error.message);
        }
    }
}