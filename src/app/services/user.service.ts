import { Injectable } from '@angular/core';
import { User } from '../Models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  users: User[] = [
    new User(1, 'Hardik Chhaganbhai', 'HC', '12345'),
    new User(2, 'Robert Deniro', 'RD', '12345'),
    new User(3, 'Virat Kohli', 'VK', '12345'),
    new User(4, 'Yogi Adiytanath', 'YA', '12345'),
  ];
}
