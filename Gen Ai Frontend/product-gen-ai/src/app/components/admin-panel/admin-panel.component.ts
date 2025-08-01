import { Component, OnInit } from '@angular/core';
import { Product, ProductService } from '../../services/product.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-panel',
  imports: [NgIf,NgFor],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent implements OnInit {
   products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productService.getAllProducts().subscribe(data => {
      this.products = data;
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.loadProducts(); // refresh list
      });
    }
  }

  updateProduct(product: Product): void {
    const updatedName = prompt('Enter new product name:', product.name);
    if (updatedName !== null) {
      const updatedProduct = { ...product, name: updatedName };
      this.productService.updateProduct(product.id!, updatedProduct).subscribe(() => {
        this.loadProducts();
      });
    }
  }

  addProduct(): void {
    const name = prompt('Enter product name:');
    const description = prompt('Enter product description:');
    const priceStr = prompt('Enter price:');
    const price = priceStr ? parseFloat(priceStr) : 0;

    if (name && description && !isNaN(price)) {
      const newProduct: Product = { name, description, price };
      this.productService.createProduct(newProduct).subscribe(() => {
        this.loadProducts();
      });
    } else {
      alert('Invalid product details');
    }
  }

  
}
