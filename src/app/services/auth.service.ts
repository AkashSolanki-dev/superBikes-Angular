import { Injectable, inject } from '@angular/core';
import { UserService } from './user.service';
import { Subject } from 'rxjs';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  isLogged: boolean = false;
  userService: UserService = inject(UserService);
  selectedUser$ = new Subject<string>();

  constructor() {
    // Check for authentication on app startup
    this.checkAuthentication();
  }

  login(user, token, cart) {
    if (user) {
      this.isLogged = true;
      // Store the authentication token or user data in local storage
      sessionStorage.setItem(this.AUTH_TOKEN_KEY, token);
      sessionStorage.setItem('user', JSON.stringify(user));
      sessionStorage.setItem('cart', cart);
    } else {
      this.isLogged = false;
    }

    return user;
  }

  logout() {
    sessionStorage.removeItem(this.AUTH_TOKEN_KEY);
    this.isLogged = false;
    alert('You have been successfully logged out');
  }

  IsAuthenticated() {
    return this.isLogged;
  }
  private checkAuthentication() {
    // Check if the authentication token or user data exists in local storage
    const authKey = sessionStorage.getItem(this.AUTH_TOKEN_KEY);
    const user = sessionStorage.getItem('user');

    if (authKey) {
      this.isLogged = true;
      // You can also emit the user data to your components using the selectedUser$ Subject
      this.selectedUser$.next(JSON.parse(user).name);
    }
  }
}
