import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyType } from '../enum/CurrencyType';
import { OrderService } from '../service/order.service';
import { Order, OrderStuff } from '../model/order.model';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  templateUrl: './order-detail.component.html',
  imports: [
    ReactiveFormsModule,
    NgForOf,
  ],
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderForm: FormGroup;
  orderId: string = '';
  currencyTypes = Object.keys(CurrencyType).filter(key => isNaN(Number(key))); // Get enum keys

  private orderService = inject(OrderService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      id: [''],
      orderDateTime: ['', Validators.required],
      orderNo: ['', Validators.required],
      orderTitle: ['', Validators.required],
      orderDeliveryType: [0, Validators.required],
      orderCurrencyType: [CurrencyType.USD, Validators.required],
      totalPrice: [0, Validators.required],
      orderClientId: [''],
      stuffs: this.fb.array([])  // FormArray for order stuffs
    });
  }

  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getOrderById(this.orderId).subscribe(order => {
      this.orderForm.patchValue(order);
      this.setStuffs(order.orderStuffs || []);  // Initialize stuffs
    });
  }

// Modify setStuffs to add an empty item if none exist
  setStuffs(stuffs: OrderStuff[]) {
    const stuffsFormArray = this.fb.array(
      stuffs.map(stuff => this.createStuffGroup(stuff))
    );

    // If no stuffs are passed, add one empty item to prevent validation errors
    if (stuffs.length === 0) {
      stuffsFormArray.push(this.createStuffGroup());
    }

    this.orderForm.setControl('stuffs', stuffsFormArray);
  }


  get stuffs(): FormArray {
    return this.orderForm.get('stuffs') as FormArray;
  }

  // Initialize stuffs FormArray with existing order stuffs
  // setStuffs(stuffs: OrderStuff[]) {
  //   const stuffsFormArray = this.fb.array(
  //     stuffs.map(stuff => this.createStuffGroup(stuff))
  //   );
  //   this.orderForm.setControl('stuffs', stuffsFormArray);
  // }

  // Create a FormGroup for each stuff item
  createStuffGroup(stuff: Partial<OrderStuff> = {}): FormGroup {
    return this.fb.group({
      id: [stuff.id || ''],  // If no ID, default to empty string
      orderId: [this.orderId],
      title: [stuff.title || 'Default Title', Validators.required],  // Default value provided
      manufacturerCountry: [stuff.manufacturerCountry || 'Unknown Country', Validators.required],
      manufacturerName: [stuff.manufacturerName || 'Unknown Manufacturer', Validators.required],
      weight: [stuff.weight || 1, Validators.required],
      price: [stuff.price || 1, Validators.required]
    });
  }

  // Add a new stuff item
  addStuff() {
    this.stuffs.push(this.createStuffGroup());
  }

  // Remove a stuff item by index
  removeStuff(index: number) {
    this.stuffs.removeAt(index);
  }

  saveOrder() {
    if (this.orderForm.valid) {
      const updatedOrder: Order = {
        ...this.orderForm.value,
        stuffs: this.orderForm.value.stuffs.map((stuff: OrderStuff) => {
          const { id, ...rest } = stuff;
          return id ? { id, ...rest } : rest;  // Exclude empty `id` fields
        })
      };
      this.orderService.updateOrder(updatedOrder).subscribe({
        next: () => {
          console.log('Order updated successfully');
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error updating order:', err);
        }
      });
    } else {
      this.showFormErrors();
    }
  }



  // Show validation errors in snackbar
  showFormErrors() {
    let errorMessage = 'Please correct the following errors:\n';

    Object.keys(this.orderForm.controls).forEach((controlName) => {
      const control = this.orderForm.get(controlName);
      if (control && control.invalid && controlName !== 'stuffs') {
        errorMessage += `• ${controlName} is required.\n`;
      }
    });

    if (this.stuffs.length === 0) {
      errorMessage += '• At least one stuff item is required.\n';
    } else {
      this.stuffs.controls.forEach((stuff, index) => {
        if (stuff.invalid) {
          errorMessage += `• Stuff item #${index + 1} has errors:\n`;
          if (stuff.get('title')?.hasError('required')) errorMessage += '  - Title is required.\n';
          if (stuff.get('manufacturerCountry')?.hasError('required')) errorMessage += '  - Manufacturer Country is required.\n';
          if (stuff.get('manufacturerName')?.hasError('required')) errorMessage += '  - Manufacturer Name is required.\n';
          if (stuff.get('weight')?.hasError('required')) errorMessage += '  - Weight is required.\n';
          if (stuff.get('price')?.hasError('required')) errorMessage += '  - Price is required.\n';
        }
      });
    }

    this.snackBar.open(errorMessage, 'Close', {
      duration: 6000,
      panelClass: ['snackbar-error']
    });
  }


  getCurrencyValue(currencyKey: string): CurrencyType {
    return CurrencyType[currencyKey as keyof typeof CurrencyType];
  }
}
