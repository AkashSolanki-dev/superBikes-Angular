import { Injectable } from '@angular/core';
import { Bike } from '../Models/bikes';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
@Injectable()
export class ProductsService {
  private bikesUrl = 'http://localhost:3000/products';
  private categories: Map<string, string> = new Map<string, string>();
  private categoryAndBikes: Map<string, Bike[]> = new Map<string, Bike[]>();
  bikes: Bike[];
  bikes$ = new BehaviorSubject<Bike[]>([]);
  categories$ = new BehaviorSubject<Map<string, string>>(this.categories);

  categoryAndBikes$ = new BehaviorSubject<Map<string, Bike[]>>(
    this.categoryAndBikes
  );
  constructor(private http: HttpClient) {}

  getData(): Observable<any> {
    return this.http.get<any>(this.bikesUrl);
  }

  // Method to store data from HTTP call
  storeData() {
    this.getData().subscribe((data) => {
      data['categories'].forEach((category) => {
        this.categories.set(category.name, category.image);
        this.categoryAndBikes.set(category.name, category.bikes);
      });
      this.categories$.next(this.categories);
      this.categoryAndBikes$.next(this.categoryAndBikes);
    });
  }

  getProducts(category: string): Bike[] {
    if (this.categoryAndBikes.has(category)) {
      this.bikes = this.categoryAndBikes.get(category);
      this.bikes$.next(this.bikes);
      return this.bikes;
    } else {
      this.bikes = Array.from(this.categoryAndBikes.values()).flat();
      this.bikes$.next(this.bikes);
      return this.bikes;
    }
  }
}
