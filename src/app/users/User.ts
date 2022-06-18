export interface User {
    _id?: string,
    username: string,
    email: string,
    password: string,
    phone: number,
    dob: Date,
    country: string,
    state: string,
    city?: string
    pinCode: number,
    admin?: boolean,
    medicines?: string[],
    roles?: string,
}