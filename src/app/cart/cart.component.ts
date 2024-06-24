import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Bike } from '../Models/bikes';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  cartItems: Bike[];
  totalItemInCart: number;
  cartService: CartService = inject(CartService);
  checkLogIn: boolean;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cartService.getCartItems$.subscribe((response) => {
      this.cartItems = response;
    });
    this.cartService.totalItemInCart$.subscribe((data) => {
      this.totalItemInCart = data;
    });
  }

  onDelete(bike: Bike): void {
    this.cartService.deleteProductFromCart(bike);
  }

  onEmptyCart(): void {
    this.cartService.emptyCart();
  }
}
