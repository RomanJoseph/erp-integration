export interface OrderStatus {
  status: string;
}

export interface ProductsSold {
  id: string;
  is_giveaway_by_coupon: string;
}

export interface OrderInvoice {
  id: string;
  link: string;
}

export interface CustomerAddress {
  id: string;
}

export interface Order {
  status: string;
  id: string;
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
  OrderStatus: OrderStatus;
  PickupLocation: any[];
  ProductsSold: ProductsSold[];
  Payment: any[];
  OrderInvoice: OrderInvoice[];
  MlOrder: any[];
  OrderTransactions: any[];
  MarketplaceOrder: any[];
  Extensions: any[];
  CustomerAddress: CustomerAddress;
  partner_name: string;
}

export interface TrayOrderResponse {
  Order: Order;
}
