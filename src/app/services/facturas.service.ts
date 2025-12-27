import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FacturasInterface } from '../interfaces/facturas.interface';
import { HttpClient } from '@angular/common/http';
import { FacturaCompletaInterface } from '../interfaces/factura-completa.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {

  private apiUrl = 'http://localhost:8000/api/siente/facturas';

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<FacturasInterface[]> {
    return this.http.get<FacturasInterface[]>(this.apiUrl);
  }

  getFacturaById(id: number): Observable<FacturaCompletaInterface> {
    return this.http.get<FacturaCompletaInterface>(`${this.apiUrl}/${id}`);
  }
}
