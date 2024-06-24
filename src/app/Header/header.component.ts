import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  clientName: string = JSON.parse(sessionStorage.getItem('user'))?.name;
  totalItemInCart: number;
  authService: AuthService = inject(AuthService);
  cartService: CartService = inject(CartService);

  ngOnInit(): void {
    this.authService.selectedUser$.subscribe((data) => {
      this.clientName = data;
    });
    this.cartService.totalItemInCart$.subscribe((data) => {
      this.totalItemInCart = data;
    });
  }
  onLogout = () => {
    this.authService.logout();
  };
}
