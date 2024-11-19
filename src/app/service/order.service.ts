import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environment/environment';
import { Order } from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = `${environment.apiBaseUrl}api/Orders`; // Adjust endpoint as needed
  private selectedOrderSubject = new BehaviorSubject<Order | null>(null);

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`);
  }

  updateOrder(order: {
    orderDateTime: any;
    orderDeliveryType: any;
    orderNo: any;
    totalPrice: any;
    orderClientId: any;
    orderCurrencyType: any;
    stuffs: any;
    id: any;
    orderTitle: any
  }): Observable<Order> {
    return this.http.put<Order>(`${this.ordersUrl}/${order.id}`, order);
  }

  // Getter and Setter for selectedOrder
  get selectedOrder$(): Observable<Order | null> {
    return this.selectedOrderSubject.asObservable();
  }

  setSelectedOrder(order: Order): void {
    this.selectedOrderSubject.next(order);
  }
}
