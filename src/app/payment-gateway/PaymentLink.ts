export interface PaymentLink {
    _id?: string,
    accept_partial: boolean,
    amount: number,
    amount_paid: number,
    callback_url: string,
    cancelled_at: number,
    created_at: string,
    currency: string,
    customer: object,
    description: string,
    expire_by: string,
    expired_at: string,
    first_min_partial_amount?: number,
    id: string,
    notes?: object,
    notify: object,
    payments?: object[],
    reference_id: string,
    reminder_enable: true,
    reminders: any[],
    short_url: string,
    status: string,
    updated_at: number,
    upi_link: boolean
}