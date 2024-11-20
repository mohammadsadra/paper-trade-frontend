import {Component, OnInit, inject, ChangeDetectorRef, OnDestroy} from '@angular/core';
import { Order } from '../model/order.model';
import { OrderService } from '../service/order.service';
import { CurrencyPipe, DatePipe, NgClass, NgForOf } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { CurrencyType } from '../enum/CurrencyType';
import { MatIcon } from '@angular/material/icon';
import { MatCard } from '@angular/material/card';
import { MatAnchor } from '@angular/material/button';
import {FormsModule} from '@angular/forms';
import {DeliveryType} from '../enum/DeliveryType';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgForOf,
    DatePipe,
    CurrencyPipe,
    RouterLink,
    MatIcon,
    MatCard,
    MatAnchor,
    NgClass,
    FormsModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  private orderService = inject(OrderService);
  filteredOrders: Order[] = [];
  searchTerm: string = '';
  isLargeScreen: boolean = true;
  constructor(private  router: Router, private cdr: ChangeDetectorRef) {
  }
  ngOnInit() {
    this.updateScreenSize();
    window.addEventListener('resize', this.updateScreenSize.bind(this));
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders.$values;
      this.filteredOrders = orders.$values;
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateScreenSize.bind(this));
  }

  updateScreenSize(): void {
    this.isLargeScreen = window.innerWidth >= 640; // Tailwind's 'sm' breakpoint
    this.cdr.detectChanges();
  }

  // Method to handle order selection
  onOrderClick(order: Order) {
    this.orderService.setSelectedOrder(order);
    this.router.navigate(['/orders', order.id])
  }

  onAddNewOrder(): void {
    this.router.navigate(['/new-order']);
  }
  filterOrders() {
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order.orderNo.toLowerCase().includes(term) ||
      order.orderTitle.toLowerCase().includes(term) ||
      order.orderClient.name.toLowerCase().includes(term) ||
      order.orderClient.family.toLowerCase().includes(term) ||
      order.orderStuffs.$values.some(stuff => stuff.title.toLowerCase().includes(term))
    );
  }

  // Convert enum to readable string
  getCurrencyName(type: CurrencyType): string {
    return CurrencyType[type];
  }
  getDeliveryName(type: DeliveryType): string {
    return DeliveryType[type];
  }
}
