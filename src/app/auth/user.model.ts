export interface User {
    id?: string,
    username: string,
    email: string,
    phone: number,
    dob: Date,
    country: string,
    state: string,
    city: string,
    pinCode: number
    token?: string
}