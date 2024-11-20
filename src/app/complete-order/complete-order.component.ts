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
  client: OrderClient | null = null;
  deliveryTypes: DeliveryTypeOption[] = [];
  currencyTypes: CurrencyTypeOption[] = [];
  calculatedPrice = 0

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrderService,
    protected router: Router,
    private deliveryTypeService: DeliveryTypeService,
    private currencyTypeService: CurrencyTypeService
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('id')!;
    this.client = this.orderService.currentSelectedClient;
    this.deliveryTypes = this.deliveryTypeService.getDeliveryTypes();
    this.currencyTypes = this.currencyTypeService.getCurrencyTypes();

    if (this.client == null) {
      this.orderService.getClientById(this.clientId).subscribe((res) => {
        this.client = res;
      });
    }

    this.completeOrderForm = this.fb.group({
      id: [null],
      orderTitle: ['', Validators.required],
      orderDateTime: [new Date(), Validators.required],
      orderDeliveryType: [DeliveryType.EXW, Validators.required],
      orderCurrencyType: [CurrencyType.USD, Validators.required],
      orderTotalPrice: [0, [Validators.required, Validators.min(0)]],
      orderStuffs: this.fb.array([this.createOrderStuff()]),
    });

    // Listen for changes in `orderStuffs` to recalculate the total price
    this.orderStuffs.valueChanges.subscribe(() => {
      this.updateTotalPrice();
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
      const newOrder = {
        orderDateTime: formValue.orderDateTime,
        orderTitle: formValue.orderTitle,
        stuffs: formValue.orderStuffs,
        orderClientId: this.clientId,
        orderDeliveryType: formValue.orderDeliveryType,
        orderCurrencyType: formValue.orderCurrencyType,
        totalPrice: formValue.orderTotalPrice, // Read from form
      };

      this.orderService.createOrder(newOrder).subscribe(
        (order) => {
          this.router.navigate(['/']).then();
        },
        (error) => {
          console.error('Error creating order:', error);
        }
      );
    }
  }

  updateTotalPrice(): void {
    const stuffs = this.orderStuffs.value;
    const totalPrice = stuffs.reduce((acc: number, item: OrderStuff) => acc + item.price * item.weight, 0);
    this.completeOrderForm.patchValue({ orderTotalPrice: totalPrice }, { emitEvent: false });
  }

  calculateTotalPrice(stuffs: OrderStuff[]): number {
    return stuffs.reduce((acc, item) => acc + item.price * item.weight, 0);
  }


}
