export type APIResponse = {
    status: 200 | 500,
    data: any,
    message?: string
}

export const APIResponseObject = (status: 200 | 500, data: any, message?: string): APIResponse => ({
    status,
    data,
    message
})