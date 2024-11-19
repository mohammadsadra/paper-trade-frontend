// enums/delivery-type.enum.ts
export enum DeliveryType {
  EXW = 0, // Ex Works
  FCA = 1, // Free Carrier
  FOB = 2, // Free on Board
  CFR = 3, // Cost and Freight
  CIF = 4, // Cost, Insurance, and Freight
  DAP = 5, // Delivered at Place
  DDP = 6, // Delivered Duty Paid
  JIT = 7, // Just-In-Time Delivery
  BULK = 8, // Bulk Delivery
  SCHEDULED = 9, // Scheduled Delivery
  DROP_SHIPPING = 10, // Drop Shipping
  CONSIGNMENT = 11, // Consignment Delivery
  WAREHOUSE_PICKUP = 12, // Warehouse Pickup
  DIRECT_TO_END_USER = 13 // Direct-to-End-User Delivery
}
