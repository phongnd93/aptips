import axios from "axios";
import { Source } from "src/@types/source";
import { API } from "src/config";

export default class SourceServices
{
    add = async (data: Source): Promise<Source | null> =>
    {
        try
        {
            const res = await axios.post(`${API}/source`, data);
            if (res?.data)
                return res.data;
        } catch (error)
        {
            console.log('SourceServices.add', error);
        }
        return null;
    }
}