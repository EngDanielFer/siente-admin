import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FacturasInterface } from '../interfaces/facturas.interface';
import { HttpClient } from '@angular/common/http';
import { FacturaCompletaInterface } from '../interfaces/factura-completa.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FacturasService {

  private readonly apiUrl = `${environment.apiUrl}/api/siente/facturas`;

  constructor(private http: HttpClient) {}

  getFacturas(): Observable<FacturasInterface[]> {
    return this.http.get<FacturasInterface[]>(this.apiUrl);
  }

  getFacturaById(id: number): Observable<FacturaCompletaInterface> {
    return this.http.get<FacturaCompletaInterface>(`${this.apiUrl}/${id}`);
  }

  crearFactura(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, payload);
  }
}
