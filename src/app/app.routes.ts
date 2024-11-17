// app-routes.ts
import { Routes, CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { Router } from '@angular/router';
import {OrderDetailComponent} from './order-detail/order-detail.component';

const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log('HOME')
    return true;  // Allow access if logged in
  } else {
    console.log('LOGIN')
    router.navigate(['/login']).then(r => {});  // Redirect to login if not logged in
    return false;
  }
};

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'login', component: LoginComponent }
];
