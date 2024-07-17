export type DonateFormConfig = {
    id?: number,
    userId: number,
    linkCode: string,
    amount?: number,
    name?: string,
    totalNumberDonations?: number,
    totalDonations?: number,
    receivedAddress: string,
    config: string,
}