import { Component, OnInit, Input } from '@angular/core';

import { User } from '../_models/index';
import { Product } from '../_models/product';
import { UserService, ProductService } from '../_services/index';

@Component({
    moduleId: module.id,
    templateUrl: 'home2.component.html'
})

export class HomeComponent implements OnInit {

    createProduct: any = {};
    updateProductOne: any = {};

    currentUser: User;
    users: User[] = [];

    products: Product[] = [];

    constructor(private productService: ProductService, private userService: UserService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
        this.loadAllProducts();
        this.createProduct = {
            name: "Test",
            price: "10",
        }
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

    addProduct() {
        this.productService.create(this.createProduct).subscribe(() => { this.loadAllProducts() })
    }

    selectUpdateProduct(_id: string) {
        this.productService.getById(_id).subscribe(user => { this.updateProductOne = user })
    }

    updateProduct() {
        if (this.updateProductOne.name)
            this.productService.update(this.updateProductOne).subscribe(() => { this.loadAllProducts() })
    }
}