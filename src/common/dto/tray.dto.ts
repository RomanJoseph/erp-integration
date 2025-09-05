export class TrayOrderDto {
  Order: OrderDetailsDto;
}

export class OrderDetailsDto {
  id: string;
  date: string;
  shipment_value: number;
  estimated_delivery_date: string;
  products_sold: ProductsSoldWrapperDto[];
}

export class ProductsSoldWrapperDto {
  ProductsSold: ProductsSoldDto;
}

export class ProductsSoldDto {
  product_id: number;
  quantity: number;
  price: number;
}
