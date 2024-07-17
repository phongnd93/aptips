export type RevenueSourceItem = {
    id: number,
    linkId: number,
    utmSource: string
}

export type RevenueItem = {
    year: number,
    month: number,
    revenue: number
}

export type RevenueResponseDTO = {
    "source": RevenueSourceItem,
    "totalRevenueByMonthList": RevenueItem[]
}[];

export type TransasctionHistory = {
    "sourceId": number,
    "senderWallet": string,
    "receiver": number,
    "amount": number
}

export type TransactionHistoryResponse = {
    "id": number,
    "sourceId": number,
    "senderWallet": string,
    "receiver": number,
    "amount": number,
    "timeStamp": string
}

export type Donator = {
    "id": number,
    "walletAddress": string,
    "email": string,
    "avatarUrl": string,
    "totalDonations": number
}

export type Transaction = {
    "id": number,
    "sourceId": number,
    sourceName: string,
    "senderInfo": Donator,
    "receiverInfo": Donator,
    "amount": number,
    "timeStamp": string,
    name: string,
    note: string

};