import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockInterface } from '../interfaces/stock.interface';

@Injectable({
  providedIn: 'root',
})
export class StockService {

  private api_url: string = "http://localhost:8000/api/siente/stock"

  constructor(private http: HttpClient) { }

  getStock(): Observable<StockInterface[]> {
    return this.http.get<StockInterface[]>(this.api_url);
  }

  createStock(stock: StockInterface): Observable<StockInterface> {
    return this.http.post<StockInterface>(this.api_url, stock);
  }

}
