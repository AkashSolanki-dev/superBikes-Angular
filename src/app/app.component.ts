import { Component, OnInit, inject } from '@angular/core';
import { ProductsService } from './services/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'superbikes-Store';
  productService: ProductsService = inject(ProductsService);
  ngOnInit(): void {
    this.productService.storeData();
  }
}
