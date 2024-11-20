import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import {OrderService} from '../service/order.service';
import {OrderClient, OrderStuff} from '../model/order.model';
import {MatIcon} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';
import {DeliveryTypeOption, DeliveryTypeService} from '../service/delivery-type.service';
import {CurrencyTypeOption, CurrencyTypeService} from '../service/currency-type.service';
import {DeliveryType} from '../enum/DeliveryType';
import {CurrencyType} from '../enum/CurrencyType';

@Component({
  selector: 'app-complete-order',
  templateUrl: './complete-order.component.html',
  styleUrls: ['./complete-order.component.css'],
  imports: [
    MatIcon,
    ReactiveFormsModule,
    NgForOf,
    NgIf
  ],
  standalone: true
})
export class CompleteOrderComponent implements OnInit {
  completeOrderForm!: FormGroup;
  clientId: string | undefined = '';
  deliveryTypes: DeliveryTypeOption[] = [];
  currencyTypes: CurrencyTypeOption[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrderService,
    protected router: Router,
    private deliveryTypeService: DeliveryTypeService,
    private currencyTypeService: CurrencyTypeService
  ) {}

  ngOnInit(): void {
    this.clientId =  this.route.snapshot.paramMap.get('id')!;
    this.deliveryTypes = this.deliveryTypeService.getDeliveryTypes();
    this.currencyTypes = this.currencyTypeService.getCurrencyTypes();

    this.completeOrderForm = this.fb.group({
      orderTitle: ['', Validators.required],
      orderDateTime: [new Date(), Validators.required],
      orderDeliveryType: [DeliveryType.EXW, Validators.required],
      orderCurrencyType: [CurrencyType.USD, Validators.required], // Adjust as per CurrencyType enum
      orderStuffs: this.fb.array([this.createOrderStuff()]),
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
        totalPrice: number;
        orderClientId: string | undefined;
        orderCurrencyType: any;
        orderTitle: any;
        orderStuffs: any
      } = {
        orderDateTime: formValue.orderDateTime,
        orderTitle: formValue.orderTitle,
        orderStuffs: formValue.orderStuffs,
        orderClientId: this.clientId,
        orderDeliveryType: formValue.orderDeliveryType,
        orderCurrencyType: formValue.orderCurrencyType,
        totalPrice: this.calculateTotalPrice(formValue.orderStuffs),
      };

      this.orderService.createOrder(newOrder).subscribe(
        (order) => {
          // Navigate to order dashboard or order details
          this.router.navigate(['/order-dashboard']).then();
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
