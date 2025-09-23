export interface CustomerAddressDetails {
    id: string;
    customer_id: string;
    address: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    type: string;
    active: string;
    description: string;
    recipient: string;
    type_delivery: string;
    not_list: string;
}

export interface CustomerAddressWrapper {
    CustomerAddress: CustomerAddressDetails;
}

export interface CustomerProfile {
    id: string;
    name: string;
    approves_registration: string;
    price_list_id?: string;
    show_price?: string;
    theme_id?: string;
    selected?: string;
}

export interface CustomerExtensions {
    Profile: CustomerProfile;
    Profiles: CustomerProfile[];
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    cpf: string;
    cnpj: string;
    newsletter: string;
    created: string;
    terms: string;
    registration_date: string;
    rg: string;
    phone: string;
    cellphone: string;
    birth_date: string;
    gender: string;
    nickname: string;
    token: string;
    total_orders: string;
    observation: string;
    type: string;
    foreign: string;
    company_name: string;
    state_inscription: string;
    reseller: string;
    discount: string;
    blocked: string;
    credit_limit: string;
    indicator_id: string;
    profile_customer_id: string;
    last_sending_newsletter: string;
    last_purchase: string;
    last_visit: string;
    last_modification: string;
    address: string;
    zip_code: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    country: string;
    modified: string;
    count_orders: string;
    Extensions: CustomerExtensions;
    CustomerAddresses: CustomerAddressWrapper[];
}

export interface Sku {
    type: string;
    value: string;
}

export interface Category {
    id: string;
    name: string;
    main_category: string;
}

export interface Stock {
    id: string;
    name: string;
}

export interface User {
    id_usuario: string;
    usuario: string;
    email_usuario: string;
}

export interface ProductsSoldDetails {
    id: string;
    order_id: string;
    product_id: string;
    name: string;
    original_name: string;
    quantity: string;
    price: string;
    cost_price: string;
    original_price: string;
    ean: string;
    brand: string;
    model: string;
    reference: string;
    weight: string;
    length: string;
    width: string;
    height: string;
    variant_id: string;
    virtual_product: string;
    availability_days: string;
    availability: string;
    Sku: Sku[];
    additional_information: string;
    text_variant: string;
    warranty: string;
    bought_together_id: string;
    ncm: string;
    included_items: string;
    release_date: string;
    commissioner_value: string;
    comissao: string;
    is_giveaway_by_coupon: string;
    is_giveaway: string;
    product_kit_id: string;
    product_kit_id_kit: string;
    id_campaign: string;
    weight_cubic: string;
    ProductSoldImage: any[];
    Category: Category[];
    BoughtTogether: any[];
    ProductSoldPackage: any[];
    ProductSoldCard: any[];
    url: { http: string; https: string; };
    Discount: any[];
    Stock: Stock;
    User?: User;
}

export interface ProductsSoldWrapper {
    ProductsSold: ProductsSoldDetails;
}

export interface OrderStatusDetails {
    id: string;
    default: string;
    type: string;
    show_backoffice: string;
    allow_edit_order: string;
    description: string;
    status: string;
    show_status_central: string;
    background: string;
    display_name: string;
    font_color: string;
}

export interface OrderInvoice {
    id: string;
    link: string;
}

export interface Order {
    id: string;
    status: string;
    date: string;
    hour: string;
    customer_id: string;
    partial_total: string;
    taxes: string;
    discount: string;
    point_sale: string;
    shipment: string;
    shipment_value: string;
    shipment_date: string;
    delivered: string;
    delivered_status: string;
    shipping_cancelled: string;
    store_note: string;
    customer_note: string;
    partner_id: string | null;
    discount_coupon: string;
    client_ip: string;
    payment_method_rate: string;
    installment: string;
    value_1: string;
    sending_code: string;
    sending_date: string;
    billing_address: string;
    delivery_time: string;
    payment_method_id: string;
    payment_method: string;
    session_id: string;
    total: string;
    payment_date: string;
    access_code: string;
    shipment_integrator: string;
    modified: string;
    printed: string;
    interest: string;
    cart_additional_values_discount: string;
    cart_additional_values_increase: string;
    id_quotation: string | null;
    estimated_delivery_date: string;
    is_traceable: string;
    external_code: string;
    tracking_url: string;
    has_payment: string;
    has_shipment: string;
    has_invoice: string;
    delivery_date: string;
    total_comission_user: string;
    total_comission: string;
    partner_name: string;
    cost: string;
    app_id: string;
    urls: { payment: string };
    store_segment: string;
    payment_method_type: 'credit_card' | 'pix' | 'bank_billet' | '';
    interest_paid_by: string;
    OrderStatus: OrderStatusDetails;
    PickupLocation: any[];
    Customer: Customer;
    ProductsSold: ProductsSoldWrapper[];
    OrderInvoice: OrderInvoice[];
    Payment: any[];
    MlOrder: any[];
    MarketplaceOrder: any[];
    OrderTransactions: any[];
    OrderInvoiceAmount: any[];
    OtherInvoiceAmounts: any[];
    ExtraTabs: any[];
    OrderChilds: any[];
    PaymentMethodMessage: any[];
}

export interface TrayOrderDto {
    Order: Order;
}