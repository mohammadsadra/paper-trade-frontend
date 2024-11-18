import { Component, OnInit, inject } from '@angular/core';
import { OrderService } from '../service/order.service';
import { Order } from '../model/order.model';
import { CurrencyType } from '../enum/CurrencyType';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {CurrencyPipe, DatePipe, NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  templateUrl: './order-detail.component.html',
  imports: [
    MatIcon,
    DatePipe,
    CurrencyPipe,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  private orderService = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  orderId: string = '';
  currencyTypes = Object.keys(CurrencyType).filter(key => isNaN(Number(key))); // Get enum keys
  ngOnInit() {
    this.orderService.selectedOrder$.subscribe((selectedOrder) => {
      if (selectedOrder) {
        this.order = selectedOrder;
      } else {
        this.orderId = this.route.snapshot.paramMap.get('id')!;
        this.orderService.getOrderById(this.orderId).subscribe(order => {
          if (!order){
            this.router.navigate(['/']);
          } else {
            this.orderService.setSelectedOrder(order);
          }

        });

      }
    });
  }

  getCurrencyName(type: CurrencyType | undefined): string {
    return type !== undefined ? CurrencyType[type] : 'Unknown Currency';
  }
  goBack() {
    this.router.navigate(['/']);
  }
}
