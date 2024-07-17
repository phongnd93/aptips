export type UserInfoResponse = {
    id: number,
    walletAddress: string,
    email: string,
    avatarUrl: string,
    totalDonations: number
}

export type AddUserInfoDto = {
    walletAddress: string,
    email: string,
    avatarUrl: string
}