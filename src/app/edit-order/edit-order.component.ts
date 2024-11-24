import {Component, OnInit} from '@angular/core';
import {OrderService} from '../service/order.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-order',
  standalone: true,
  imports: [],
  templateUrl: './edit-order.component.html',
  styleUrl: './edit-order.component.css'
})
export class EditOrderComponent implements OnInit{

  orderId = '';
  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private snackbar: MatSnackBar,
  ) {
  }
  ngOnInit() {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    console.log(this.route.snapshot.paramMap.get('id')!)
    if (!this.orderService.currentSelectedOrder){
      if (this.orderId == '' || this.orderId == null){
        this.router.navigate(['/']).then();
        this.snackbar.open('The desired order was not found.',
          '    ',{duration: 3000, verticalPosition: 'bottom', // 'top' | 'bottom'
            horizontalPosition: 'center', //'start' | 'center' | 'end' | 'left' | 'right'
            panelClass: 'error-snackbar'});
      } else {

      }
    }
  }
}
