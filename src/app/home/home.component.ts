import { Component, OnInit, inject } from '@angular/core';
import {Order} from '../model/order.model';
import {OrderService} from '../service/order.service';
import {CurrencyPipe, DatePipe, NgForOf} from '@angular/common';
import {RouterLink} from '@angular/router';
import {CurrencyType} from '../enum/CurrencyType';
import {MatIcon} from '@angular/material/icon';
import {MatCard} from '@angular/material/card';
import {MatAnchor} from '@angular/material/button';


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
    MatAnchor
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  orders: Order[] = [];
  private orderService = inject(OrderService);

  ngOnInit() {
    this.orderService.getOrders().subscribe((orders) => {
      this.orders = orders;
    });
  }

  // Convert enum to readable string
  getCurrencyName(type: CurrencyType): string {
    return CurrencyType[type];
  }
}
