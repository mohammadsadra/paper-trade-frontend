import { Component, OnInit, inject } from '@angular/core';
import { OrderService } from '../service/order.service';
import { Order } from '../model/order.model';
import { CurrencyType } from '../enum/CurrencyType';
import {ActivatedRoute, Router} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {CurrencyPipe, DatePipe, DecimalPipe, NgForOf, NgIf} from '@angular/common';
import {DeliveryTypeService} from '../service/delivery-type.service';
import {CurrencyTypeService} from '../service/currency-type.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  templateUrl: './order-detail.component.html',
  imports: [
    MatIcon,
    DatePipe,
    CurrencyPipe,
    NgIf,
    NgForOf,
    DecimalPipe
  ],
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: Order | null = null;
  private orderService = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected deliveryService = inject(DeliveryTypeService);
  protected currencyService = inject(CurrencyTypeService);

  orderId: string = '';
  currencyTypes = Object.keys(CurrencyType).filter(key => isNaN(Number(key))); // Get enum keys
  ngOnInit() {
    this.orderService.selectedOrder$.subscribe((selectedOrder) => {
      this.orderId = this.route.snapshot.paramMap.get('id')!;
      if (selectedOrder) {
        this.order = selectedOrder;
      } else {
        this.orderService.getOrderById(this.orderId).subscribe(order => {
          if (!order){
            this.router.navigate(['/']).then();
          } else {
            this.orderService.setSelectedOrder(order);
          }

        });

      }
    });
  }


  goBack() {
    this.router.navigate(['/']).then();
  }
  editOrder() {
    console.log(this.orderId)
    this.router.navigate(['/edit-order', this.orderId]).then();
  }
}
