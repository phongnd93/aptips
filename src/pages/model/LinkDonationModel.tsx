

export type LinkDonationModel = {
    userCreator: string,
    orderDate: Date,
    link: string,
    donation: number,
    donators: number,
}

export type DetailLinkMode = {
    listUserDonate: UserDonation[],

}

export type UserDonation = {
    userDonate: string,
    orderDate: Date,
    source: string, 
    moneyDoate: string,
}