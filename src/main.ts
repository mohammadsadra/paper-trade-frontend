// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import {routes} from './app/app.routes';
import {tokenInterceptor} from './app/auth/token-interceptor.service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideRouter(routes), provideAnimationsAsync(), provideAnimationsAsync(),

  ]
}).catch(err => console.error(err));
