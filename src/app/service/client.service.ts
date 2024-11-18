import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {OrderClient} from '../model/order.model';
import {environment} from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ClientService {

  private apiUrl = environment.apiBaseUrl + 'api/Clients'; // Replace with your actual API URL

  constructor(private http: HttpClient) {}

  // Method to update client information
  updateClient(client: OrderClient): Observable<OrderClient> {
    const url = `${this.apiUrl}/${client.id}`;
    return this.http.put<OrderClient>(url, client);
  }
}
