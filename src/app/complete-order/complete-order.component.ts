import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import {OrderService} from '../service/order.service';
import {OrderClient, OrderStuff} from '../model/order.model';
import {MatIcon} from '@angular/material/icon';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrls: ['./complete-order.component.css'],
  imports: [
    MatIcon,
    ReactiveFormsModule,
    NgForOf
  ],
  standalone: true
})
export class CompleteOrderComponent implements OnInit {
  completeOrderForm!: FormGroup;
  clientId: string = '';

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrderService,
    protected router: Router
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId') || '';
    this.completeOrderForm = this.fb.group({
      orderTitle: ['', Validators.required],
      orderDateTime: [new Date(), Validators.required],
      orderDeliveryType: [1, Validators.required],
      orderCurrencyType: ['USD', Validators.required], // Adjust as per CurrencyType enum
      orderStuffs: this.fb.array([this.createOrderStuff()]),
      // Add other order fields as necessary
    });
  }

  createOrderStuff(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      manufacturerCountry: ['', Validators.required],
      manufacturerName: ['', Validators.required],
      weight: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  get orderStuffs(): FormArray {
    return this.completeOrderForm.get('orderStuffs') as FormArray;
  }

  addOrderStuff() {
    this.orderStuffs.push(this.createOrderStuff());
  }

  removeOrderStuff(index: number) {
    if (this.orderStuffs.length > 1) {
      this.orderStuffs.removeAt(index);
    }
  }

  submitOrder() {
    if (this.completeOrderForm.valid) {
      const formValue = this.completeOrderForm.value;
      const newOrder: {
        orderDateTime: any;
        orderDeliveryType: any;
        orderNo: string;
        totalPrice: number;
        orderClient: OrderClient;
        orderClientId: string;
        orderCurrencyType: any;
        id: string;
        orderTitle: any;
        orderStuffs: { $values: any; $id: string };
        createDateTime: string
      } = {
        id: '', // Will be set by backend
        createDateTime: new Date().toISOString(),
        orderDateTime: formValue.orderDateTime,
        orderNo: '', // Can be generated or handled by backend
        orderTitle: formValue.orderTitle,
        orderStuffs: {
          $id: '', // Reference ID as per your backend
          $values: formValue.orderStuffs,
        },
        orderClient: { id: this.clientId } as OrderClient, // Simplified
        orderClientId: this.clientId,
        orderDeliveryType: formValue.orderDeliveryType,
        orderCurrencyType: formValue.orderCurrencyType,
        totalPrice: this.calculateTotalPrice(formValue.orderStuffs),
      };

      this.orderService.createOrder(newOrder).subscribe(
        (order) => {
          // Navigate to order dashboard or order details
          this.router.navigate(['/order-dashboard']);
        },
        (error) => {
          console.error('Error creating order:', error);
          // Handle error (e.g., show notification)
        }
      );
    }
  }

  calculateTotalPrice(stuffs: OrderStuff[]): number {
    return stuffs.reduce((acc, item) => acc + item.price * item.weight, 0);
  }
}
