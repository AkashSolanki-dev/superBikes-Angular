import { Injectable } from '@angular/core';
import { Bike } from '../Models/bikes';
import { ProductsService } from './products.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private bikes: Bike[];
  private cart: Bike[] = [];
  private bikeAddedToCart: Map<number, boolean> = new Map<number, boolean>();
  private totalItemInCart = 0;

  bikeAddedToCart$ = new BehaviorSubject<Map<number, boolean>>(
    this.bikeAddedToCart
  );
  totalItemInCart$ = new BehaviorSubject<number>(this.totalItemInCart);
  getCartItems$ = new BehaviorSubject<Bike[]>(this.cart);
  userId = JSON.parse(sessionStorage.getItem('user'))?.['id'];
  constructor(
    private productService: ProductsService,
    private http: HttpClient
  ) {
    this.loadCartFromLocalStorage();
    this.productService.bikes$.subscribe({
      next: (bikes) => {
        this.bikes = bikes;
        console.log(this.bikes);
        this.initializeBikeStatus();
      },
    });
  }

  addToCart(id: number): void {
    const addedBikeToCart = this.bikes.find((bike) => bike.id === id);
    this.http
      .put('http://localhost:3000/cart/' + this.userId, {
        bike: addedBikeToCart,
      })
      .subscribe((data) => console.log(data));
    this.totalItemInCart++;
    this.totalItemInCart$.next(this.totalItemInCart);
    this.bikeAddedToCart.set(id, true);
    this.bikeAddedToCart$.next(this.bikeAddedToCart);
    this.cart.push(addedBikeToCart);
    this.getCartItems$.next(this.cart);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  deleteProductFromCart(bike: Bike): void {
    this.cart = this.cart.filter((item) => item.id !== bike.id);
    this.http
      .delete('http://localhost:3000/cart/' + this.userId, {
        body: { id: bike.id },
      })
      .subscribe((data) => console.log(data));
    this.getCartItems$.next(this.cart);
    this.totalItemInCart--;
    this.totalItemInCart$.next(this.totalItemInCart);
    this.bikeAddedToCart.set(bike.id, false);
    this.bikeAddedToCart$.next(this.bikeAddedToCart);
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  emptyCart(): void {
    this.http
      .delete('http://localhost:3000/cart/' + this.userId)
      .subscribe((data) => console.log(data));
    this.cart = [];
    this.totalItemInCart = 0;
    this.getCartItems$.next(this.cart);
    this.totalItemInCart$.next(0);
    this.initializeBikeStatus();
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  private loadCartFromLocalStorage(): void {
    this.cart = JSON.parse(localStorage.getItem('cart')) || [];
    this.totalItemInCart = this.cart.length;
    this.totalItemInCart$.next(this.totalItemInCart);
    this.getCartItems$.next(this.cart);
  }

  private initializeBikeStatus(): void {
    this.bikeAddedToCart.clear();
    this.bikes.forEach((bike) => this.bikeAddedToCart.set(bike.id, false));
    this.cart.forEach((e) => {
      this.bikeAddedToCart.set(e.id, true);
    });
    console.log(this.bikeAddedToCart);
    this.bikeAddedToCart$.next(this.bikeAddedToCart);
  }
}
