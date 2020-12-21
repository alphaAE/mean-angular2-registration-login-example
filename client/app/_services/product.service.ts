import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { appConfig } from '../app.config';
import { Product } from '../_models/index';

@Injectable()
export class ProductService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Product[]>(appConfig.apiUrl + '/products');
    }

    getById(_id: string) {
        return this.http.get(appConfig.apiUrl + '/products/' + _id);
    }

    create(product: Product) {
        return this.http.post(appConfig.apiUrl + '/products/add', product);
    }

    update(product: Product) {
        return this.http.put(appConfig.apiUrl + '/products/' + product._id, product);
    }

    delete(_id: string) {
        return this.http.delete(appConfig.apiUrl + '/products/' + _id);
    }
}