import { string } from "yup"


export type LinkDonationModel = {
    id: number,
    userId: number,
    linkCode: string,
    receivedAddress: string,
    amount: number,
    name: string,
    config: string
    createdAt: string,

    sui: number,
    orderdate?: string,
    totalDonations: number,
    totalNumberDonations: number
}