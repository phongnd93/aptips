export type FormConfigResponse = {
    id: number,
    userId: number,
    linkCode: string,
    amount: number,
    name: string,
    totalNumberDonations: number,
    totalDonations: number,
    receivedAddress: string,
    config: any,
}

export type AddFormConfig = {
    userId: number,
    linkCode: string,
    config: any,
    amount: number,
    name: string,
    receivedAddress: string,
}