import { Injectable } from '@angular/core';
//
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from './message.service';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../interface/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private ProductsUrl = 'api/products';  // URL to web api

  constructor(
    private http: HttpClient,
    private messageService: MessageService) { }

  /** Log a ProductService message with the ProductService */
  private log(message: string) {
    this.messageService.add(`MessageService: ${message}`);
  }

  /* Old function for mock Products
  getProducts(): Observable<Product[]> {
    return of(Products);
  }
  */

  /** GET Products from the server */
  getProducts(): Observable<Product[]> {
    // TODO: send the message _after_ fetching the Products
    this.messageService.add('ProductService: fetched Products');

    return this.http.get<Product[]>(this.ProductsUrl).pipe(
      tap(Products => this.log('fetched Products')),
      catchError(this.handleError('getProducts', []))
    );
  }

  /** GET Product by id. Will 404 if id not found */
  getProduct(id: number): Observable<Product> {
    const url = `${this.ProductsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => this.log(`fetched Product id=${id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
