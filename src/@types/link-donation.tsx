import { string } from "yup"


export type LinkDonationModel = {
    id: number,
    userId: number,
    linkCode: string,
    receivedAddress: string,
    amount: number,
    name: string,
    config: string

    sui: number,
    orderdate?: string,
}

export type UserLinkDonateModel = {
    id: number,
    name: string,
    amount: number,
    note: string,
    timeStamp: string,
    sourceId: number,
}

// "id": 0,
// "sourceId": 0,
// "senderWallet": "string",
// "receiver": 0,
// "amount": 0,
// "timeStamp": "2024-05-28T18:54:10.676Z"