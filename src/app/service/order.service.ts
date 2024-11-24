import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environment/environment';
import {Order, OrderClient} from '../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private ordersUrl = `${environment.apiBaseUrl}api/Orders`; // Adjust endpoint as needed
  private clientsUrl = `${environment.apiBaseUrl}api/Clients`; // Adjust endpoint as needed
  private selectedOrderSubject = new BehaviorSubject<Order | null>(null);
  private selectedClient = new BehaviorSubject<OrderClient | null>(null);

  constructor(private http: HttpClient) {}

  getOrders(): Observable<any> {
    return this.http.get<Order[]>(this.ordersUrl);
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/${id}`);
  }

  // Getter and Setter for selectedOrder
  get selectedOrder$(): Observable<Order | null> {
    return this.selectedOrderSubject.asObservable();
  }

  get currentSelectedOrder(): Order | null {
    return this.selectedOrderSubject.value;
  }

  setSelectedClient(client: OrderClient): void {
    this.selectedClient.next(client);
  }

  get selectedClient$(): Observable<OrderClient | null> {
    return this.selectedClient.asObservable();
  }

  get currentSelectedClient(): OrderClient | null {
    return this.selectedClient.value;
  }

  setSelectedOrder(order: Order): void {
    this.selectedOrderSubject.next(order);
  }

// Fetch all clients
  getAllClients(): Observable<any> {
    return this.http.get(`${this.clientsUrl}`);
  }
  getClientById(id: string): Observable<OrderClient> {
    return this.http.get<OrderClient>(`${this.clientsUrl}/${id}`);
  }

  // Create a new client
  createClient(client: Partial<OrderClient>): Observable<OrderClient> {
    return this.http.post<OrderClient>(`${this.clientsUrl}`, client);
  }

  updateClient(client: Partial<OrderClient>): Observable<OrderClient> {
    return this.http.put<OrderClient>(`${this.clientsUrl}/${client.id}`, client);
  }

  deleteClient(id: string | undefined): Observable<OrderClient> {
    return this.http.delete<OrderClient>(`${this.clientsUrl}/${id}`);
  }

  // Create a new order
  createOrder(order: {
    orderDateTime: any;
    orderDeliveryType: any;
    totalPrice: number;
    orderClientId: string | undefined;
    orderCurrencyType: any;
    orderTitle: any;
    stuffs: any
  }): Observable<any> {
    return this.http.post<Order>(`${this.ordersUrl}`, order);
  }

}
