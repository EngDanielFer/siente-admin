import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StockInterface } from '../interfaces/stock.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StockService {

  private readonly apiUrl = `${environment.apiUrl}/api/siente/stock`

  constructor(private http: HttpClient) { }

  getStock(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createStock(payload: { id_producto: number; cantidad_producto: number }): Observable<any> {
    return this.http.post<StockInterface>(this.apiUrl, payload);
  }

}
