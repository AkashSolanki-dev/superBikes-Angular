import { Component, inject } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Bike } from '../Models/bikes';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';
import { FormControl, FormGroup } from '@angular/forms';
import { switchMap, toArray } from 'rxjs';
import { JsonpInterceptor } from '@angular/common/http';

enum Order {
  ascending = 1,
  descending,
  none,
}
interface CategoryFormValues {
  Bicycle: boolean;
  CityBikes: boolean;
  SportBikes: boolean;
}
@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  productsService = inject(ProductsService);
  catergoryFromUrl: string;
  checkLogIn: boolean = false;
  id: number;
  AllBikes: Bike[] = [];
  bikeAddedToCart: boolean[];
  currentPage: number = 1;
  sortOrder: Order = 3;
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  cartService: CartService = inject(CartService);
  categoryForm: FormGroup;
  router: Router = inject(Router);
  queryParams: Params;
  ngOnInit() {
    this.initializeForm();
    this.productsService
      .getData()
      .pipe(
        switchMap(() =>
          this.productsService.getProducts(this.catergoryFromUrl)
        ),
        toArray()
      )
      .subscribe((bikes) => {
        // Handle the bikes data here
        // this.AllBikes = bikes;
        this.handleUrlCategory();
      });
    this.subscribeToCartChanges();
    this.subscribeToFormChanges();
  }
  onBuyNow = (bikeId: number, indexOnPage: number) => {
    const absoluteIndex = 3 * (this.currentPage - 1) + indexOnPage;
    if (!this.authService.IsAuthenticated()) {
      this.checkLogIn = !this.authService.IsAuthenticated();
      this.id = bikeId;
    } else if (!this.bikeAddedToCart[absoluteIndex]) {
      this.cartService.addToCart(bikeId);
      // this.bikeAddedToCart[index] = true;
    }
  };
  isDisable(indexOnPage: number): boolean {
    const absoluteIndex = 3 * (this.currentPage - 1) + indexOnPage;
    return this.bikeAddedToCart[absoluteIndex];
  }
  sort(order: string): void {
    if (order === 'ascending') {
      this.AllBikes = this.AllBikes.slice().sort((a, b) => a.price - b.price);
      this.sortOrder = 1;
    } else {
      this.AllBikes = this.AllBikes.slice().sort((a, b) => b.price - a.price);
      this.sortOrder = 2;
    }
    this.productsService.bikes$.next(this.AllBikes);
  }

  private initializeForm() {
    this.categoryForm = new FormGroup({
      Bicycle: new FormControl(true),
      CityBikes: new FormControl(true),
      SportBikes: new FormControl(true),
    });
  }
  private handleUrlCategory(): void {
    const queryParams: Params = this.activeRoute.snapshot.queryParams;

    if (Object.keys(queryParams).length > 0) {
      for (const key of Object.keys(queryParams)) {
        if (queryParams[key] === 'true') {
          const formattedKey = key?.replace(/([A-Z])/g, ' $1').trim();
          this.AllBikes.push(...this.productsService.getProducts(formattedKey));
          this.categoryForm.controls[key].setValue(true);
        } else this.categoryForm.controls[key].setValue(false);
      }
    } else {
      const categoryFromUrl =
        this.activeRoute.snapshot.params['category']
          ?.replace(/([A-Z])/g, ' $1')
          .trim() ||
        ('AllBikes' as 'AllBikes' | 'Bicycle' | 'City Bikes' | 'Sport Bikes');
      const categoryMap: Record<string, CategoryFormValues> = {
        AllBikes: { Bicycle: true, CityBikes: true, SportBikes: true },
        Bicycle: { Bicycle: true, CityBikes: false, SportBikes: false },
        'City Bikes': { Bicycle: false, CityBikes: true, SportBikes: false },
        'Sport Bikes': { Bicycle: false, CityBikes: false, SportBikes: true },
      };

      this.categoryForm.setValue(
        categoryMap[categoryFromUrl] || {
          Bicycle: false,
          CityBikes: false,
          SportBikes: false,
        },
        { emitEvent: false }
      );

      this.AllBikes = this.productsService.getProducts(categoryFromUrl);
    }

    this.productsService.bikes$.next(this.AllBikes);
  }
  private subscribeToCartChanges() {
    this.cartService.bikeAddedToCart$.subscribe((response) => {
      this.bikeAddedToCart = Array.from(response.values());
    });
  }
  private subscribeToFormChanges() {
    this.categoryForm.valueChanges.subscribe((data) => {
      const queryParams = {};
      this.AllBikes = [];
      for (const key of Object.keys(data)) {
        if (data[key]) {
          const formattedKey = key?.replace(/([A-Z])/g, ' $1').trim();
          this.AllBikes.push(...this.productsService.getProducts(formattedKey));
        }
        queryParams[key] = data[key];
      }
      this.productsService.bikes$.next(this.AllBikes);
      this.router.navigate([], {
        relativeTo: this.activeRoute,
        queryParams,
        queryParamsHandling: 'merge', // Use 'merge' to add/modify query params
      });
    });
  }
}
