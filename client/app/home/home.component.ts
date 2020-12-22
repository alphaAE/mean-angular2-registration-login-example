import { Component, OnInit, Input } from '@angular/core';

import { User } from '../_models/index';
import { Product } from '../_models/product';
import { UserService, ProductService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home2.component.html'
})

export class HomeComponent implements OnInit {

    @Input() createProduct: Product;

    currentUser: User;
    users: User[] = [];

    products: Product[] = [];

    constructor(private productService: ProductService, private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
        this.loadAllProducts();
    }


    deleteUser(_id: string) {
        this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }

    deleteProduct(_id: string) {
        this.productService.delete(_id).subscribe(() => { this.loadAllProducts() })
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }

    private loadAllProducts() {
        this.productService.getAll().subscribe(products => { 
            this.products = products;
        })
    }
}