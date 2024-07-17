import axios from "axios"
import { API } from "src/config"
import { Donator, RevenueResponseDTO, Transaction, TransactionHistoryResponse, TransasctionHistory } from '../pages/model/TransactionModel';

export default class TransactionServices
{
    transactions = async (userId: number) =>
    {
        try
        {
            const res = await axios.get(`${API}/transaction-history/transactions-by-user/${userId}`);
            if (res?.data)
                return res.data as Transaction[];
        } catch (error)
        {
            console.log('TransactionServices.transactions', error);
            // APIResponseObject(500, null, error.message);
        }
        return [] as Transaction[];
    }

    revenue = async (userId: number) =>
    {
        try
        {
            const res = await axios.get(`${API}/transaction-history/month-revenue-of-source-user/${userId}`);
            if (res?.data)
                return res.data as RevenueResponseDTO;
        } catch (error)
        {
            console.log('TransactionServices.revenue', error);
        }

        return [] as RevenueResponseDTO;
    }

    add = async (data: TransasctionHistory) =>
    {
        try
        {
            const res = await axios.post(`${API}/transaction-history`, data);
            if (res?.data)
                return res.data as TransactionHistoryResponse;
        } catch (error)
        {
            console.log('TransactionServices.add', error);
        }
        return null;
    }

    topDonators = async (userId: number, limit: number) =>
    {
        try
        {
            const res = await axios.get(`${API}/transaction-history/most-donations-user/${userId}?num=${limit}`);
            if (res?.data)
                return res.data as Donator[];
        } catch (error)
        {
            console.log('TransactionServices.add', error);
        }
        return [] as Donator[];
    }
}