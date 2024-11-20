// src/app/services/delivery-type.service.ts
import { Injectable } from '@angular/core';
import {DeliveryType} from '../enum/DeliveryType';

export interface DeliveryTypeOption {
  value: DeliveryType;
  label: string;
}

@Injectable({
  providedIn: 'root',
})
export class DeliveryTypeService {
  private deliveryTypes: DeliveryTypeOption[] = [
    { value: DeliveryType.EXW, label: 'Ex Works' },
    { value: DeliveryType.FCA, label: 'Free Carrier' },
    { value: DeliveryType.FOB, label: 'Free on Board' },
    { value: DeliveryType.CFR, label: 'Cost and Freight' },
    { value: DeliveryType.CIF, label: 'Cost, Insurance, and Freight' },
    { value: DeliveryType.DAP, label: 'Delivered at Place' },
    { value: DeliveryType.DDP, label: 'Delivered Duty Paid' },
    { value: DeliveryType.JIT, label: 'Just-In-Time Delivery' },
    { value: DeliveryType.BULK, label: 'Bulk Delivery' },
    { value: DeliveryType.SCHEDULED, label: 'Scheduled Delivery' },
    { value: DeliveryType.DROP_SHIPPING, label: 'Drop Shipping' },
    { value: DeliveryType.CONSIGNMENT, label: 'Consignment Delivery' },
    { value: DeliveryType.WAREHOUSE_PICKUP, label: 'Warehouse Pickup' },
    { value: DeliveryType.DIRECT_TO_END_USER, label: 'Direct-to-End-User Delivery' },
  ];

  constructor() {}

  getDeliveryTypes(): DeliveryTypeOption[] {
    return this.deliveryTypes;
  }

  getDeliveryLabelById(value: number | undefined): string {
    const deliveryType = this.deliveryTypes.find((type) => type.value === value);
    return deliveryType ? deliveryType.label : 'Unknown Delivery Type';
  }
}
