import { CurrencyType } from '../enum/CurrencyType';

export interface Order {
  id: string;
  createDateTime: string;
  orderDateTime: string;
  orderNo: string;
  orderTitle: string;
  orderStuffs: {
    $id: string;
    $values: OrderStuff[];
  };
  orderClient: OrderClient;
  orderClientId: string;
  orderDeliveryType: number;
  orderCurrencyType: CurrencyType; // Use enumeration here
  totalPrice: number;
}

export interface OrderStuff {
  id: string;
  createDateTime: string;
  orderId: string;
  stuffOrder?: { $ref: string }; // Adjusted to handle references
  title: string;
  manufacturerCountry: string;
  manufacturerName: string;
  weight: number;
  price: number;
}

export interface OrderClient {
  $id: string;
  name: string;
  family: string;
  id: string;
  createDateTime: string;
}
