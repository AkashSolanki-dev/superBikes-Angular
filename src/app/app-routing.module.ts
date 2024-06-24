import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ProductsComponent } from './Products/products.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { LoginComponent } from './login/login.component';
import { BikeDetailComponent } from './Products/bike-detail/bike-detail.component';
import { authGuard } from './services/auth-guard.guard';
import { CartComponent } from './cart/cart.component';

//define routes

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'products/:category', component: ProductsComponent },
  { path: 'products', component: ProductsComponent },
  {
    path: 'bike/:id',
    component: BikeDetailComponent,
    canActivate: [authGuard],
  },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'Login', component: LoginComponent },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [authGuard],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
