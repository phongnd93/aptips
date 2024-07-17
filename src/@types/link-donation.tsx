import { string } from "yup"


export type LinkDonationModel = {
    id: number,
    userId: number,
    linkCode: string,
    receivedAddress: string,
    amount: number,
    name: string,
    config: string

    orderdate?: string,
}

export type UserLinkDonateModel = {
    walletAddress: string,
    email: string,
    avatarUrl: string,
    totalDonations: number,
  
    orderdate: string,
    source: string,
}