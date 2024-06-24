import { Component, OnInit, inject } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Bike } from '../Models/bikes';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  categories: { category: string; image: string }[];
  recentlyViewedProducts: Bike[] = [];
  accordionStatus = false;
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

  private productService: ProductsService = inject(ProductsService);

  ngOnInit(): void {
    this.recentlyViewedProducts =
      JSON.parse(sessionStorage.getItem('viewedBikes')) || [];
    setTimeout(() => (this.accordionStatus = !this.accordionStatus), 1200);
    this.productService.categories$.subscribe(
      (data) =>
        (this.categories = Array.from(data, ([category, image]) => ({
          category,
          image,
        })))
    );
  }
  isAccordionOpen = (): boolean => {
    this.accordionStatus
      ? window.scrollTo(0, document.body.scrollHeight)
      : window.scrollTo(0, 0);
    this.accordionStatus = !this.accordionStatus;
    return this.accordionStatus;
  };
}
