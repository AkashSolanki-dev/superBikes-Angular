import { Component, inject } from '@angular/core';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Bike } from '../../Models/bikes';
import { CartService } from '../../services/cart.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClient } from '@angular/common/http';
import { concatMap, of } from 'rxjs';

@Component({
  selector: 'bike-detail',
  styleUrl: './bike-detail.component.css',
  templateUrl: './bike-detail.component.html',
})
export class BikeDetailComponent {
  selectedbike: Bike;
  bikeId: number;
  similarProducts: Bike[];
  similarProductsSrc: string[];
  viewedBikes: Bike[] = []; // I have to push
  isBikeAddedToCart: boolean = false;
  productNotFound: boolean = false;

  bikeService: ProductsService = inject(ProductsService);
  activeRoute: ActivatedRoute = inject(ActivatedRoute);
  cartService: CartService = inject(CartService);
  http: HttpClient = inject(HttpClient);
  paramMapObs;
  customOptions: OwlOptions = {
    loop: false,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 2,
      },
      740: {
        items: 3,
      },
      940: {
        items: 3,
      },
    },
    nav: true,
  };

  ngOnInit() {
    this.viewedBikes = JSON.parse(sessionStorage.getItem('viewedBikes')) || [];
    this.bikeId = this.activeRoute.snapshot.params['id'];

    this.http
      .get('http://localhost:3000/bike/' + this.bikeId)
      .pipe(
        concatMap((data) => {
          this.selectedbike = data['matchingBike'];
          this.addToViewedBikes(this.selectedbike);
          this.similarProducts = data['similarBikes'];
          this.similarProductsSrc = this.similarProducts.map(
            (bike) => bike.image
          );
          return of(null);
        })
      )
      .subscribe(
        () => {
          this.cartService.bikeAddedToCart$.subscribe((data) => {
            this.isBikeAddedToCart = data.get(this.selectedbike?.id);
          });
        },
        (error) => {
          this.productNotFound = true;
        }
      );
  }

  addToCart = (bikeId: number) => {
    this.cartService.addToCart(bikeId);
    this.isBikeAddedToCart = true;
  };

  private addToViewedBikes(bike: Bike): void {
    const containsBike = this.viewedBikes.some(
      (viewedBike) => viewedBike.id === bike.id
    );
    if (!containsBike) {
      this.viewedBikes.push(bike);
      sessionStorage.setItem('viewedBikes', JSON.stringify(this.viewedBikes));
    }
  }
}
