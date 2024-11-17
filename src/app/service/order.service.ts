// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from '../../environment/environment';
import {Order} from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = `${environment.apiBaseUrl}api/Orders`; // Adjust endpoint as needed

  constructor(private http: HttpClient) {}

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`);
  }

  updateOrder(order: Order): Observable<Order> {
    return this.http.put<Order>(`${this.ordersUrl}/${order.id}`, order);
  }
}
