import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductosInterface } from '../interfaces/productos.interface';
import { CrearProductoDtoInterface } from '../interfaces/crear-producto-dto.interface';
import { ProductoCompletoInterface } from '../interfaces/producto-completo.interface';
import { CostoFijoInterface } from '../interfaces/costo-fijo.interface';
import { InsumosProductoInterface } from '../interfaces/insumos-producto.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {

  private readonly apiUrl = `${environment.apiUrl}/api/siente/productos`

  constructor(private http: HttpClient) { }

  getProductos(): Observable<ProductosInterface[]> {
    return this.http.get<ProductosInterface[]>(this.apiUrl);
  }

  getProductoById(id: number): Observable<ProductosInterface> {
    return this.http.get<ProductosInterface>(`${this.apiUrl}/${id}`);
  }

  getProductoCompleto(id: number): Observable<ProductoCompletoInterface> {
    return this.http.get<ProductoCompletoInterface>(`${this.apiUrl}/${id}/completo`);
  }

  createProducto(producto: CrearProductoDtoInterface): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  updateProducto(id: number, producto: CrearProductoDtoInterface): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, producto);
  }

  deleteProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getCostosFijos(productoId: number): Observable<CostoFijoInterface[]> {
    return this.http.get<CostoFijoInterface[]>(`${this.apiUrl}/${productoId}/costos-fijos`);
  }

  getInsumos(productoId: number): Observable<InsumosProductoInterface[]> {
    return this.http.get<InsumosProductoInterface[]>(`${this.apiUrl}/${productoId}/insumos`);
  }

}
