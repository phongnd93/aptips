import { string } from "yup"


export type LinkDonationModel = {
    id: number,
    userId: number,
    linkCode: string,
    receivedAddress: string,
    amount: number,
    name: string,
    config: string

    totalSUI: number,
    totalDonate: number,
    orderdate?: string,
}

export type UserLinkDonateModel = {
    id: number,
    senderWallet: string,
    totalDonations: number,
    sourceId: number,
    timeStamp: string,
    receiver: string,
}

// "id": 0,
// "sourceId": 0,
// "senderWallet": "string",
// "receiver": 0,
// "amount": 0,
// "timeStamp": "2024-05-28T18:54:10.676Z"