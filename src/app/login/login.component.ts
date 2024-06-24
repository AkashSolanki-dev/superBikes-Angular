import { Component, ElementRef, ViewChild, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { User } from '../Models/user';
import { Bike } from '../Models/bikes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  @ViewChild('username') username: ElementRef;
  @ViewChild('password') password: ElementRef;

  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  http: HttpClient = inject(HttpClient);
  ngOnInit() {
    this.activeRoute.queryParamMap.subscribe((queries) => {
      const logout = Boolean(queries.get('logout'));
      if (logout) {
        this.authService.logout();
        alert(
          'You are now logged out. IsLogged = ' + this.authService.isLogged
        );
      }
    });
  }

  OnLoginClicked() {
    const username = this.username.nativeElement.value;
    const password = this.password.nativeElement.value;
    let user: User, token: string, cart: Bike[];
    this.http
      .post('http://localhost:3000/login', { username, password })
      .subscribe(
        (data) => {
          user = data['user'];
          token = data['token'];
          cart = data['cart'];
          this.authService.login(user, token, cart);
          alert('Welcome ' + user.name + '. You are logged in.');
          this.router.navigate(['products']);
          this.authService.selectedUser$.next(user.name);
        },
        (error) => {
          alert('The login credentials you have entered is not correct.');
          this.username.nativeElement.value = '';
          this.password.nativeElement.value = '';
          this.username.nativeElement.focus();
        }
      );
    // const user = this.authService.login(username, password);

    // if (user === undefined) {
    //   alert('The login credentials you have entered is not correct.');
    // } else {
    //   alert('Welcome ' + user.name + '. You are logged in.');
    //   this.router.navigate(['products']);
    //   this.authService.selectedUser$.next(user.name);
    // }
  }
}
