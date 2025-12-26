import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductosInterface } from '../interfaces/productos.interface';
import { CrearProductoDtoInterface } from '../interfaces/crear-producto-dto.interface';
import { ProductoCompletoInterface } from '../interfaces/producto-completo.interface';
import { CostoFijoInterface } from '../interfaces/costo-fijo.interface';
import { InsumosProductoInterface } from '../interfaces/insumos-producto.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductosService {

  private api_url: string = "http://localhost:8000/api/siente/productos"

  constructor(private http: HttpClient) { }

  getProductos(): Observable<ProductosInterface[]> {
    return this.http.get<ProductosInterface[]>(this.api_url);
  }

  getProductoById(id: number): Observable<ProductosInterface> {
    return this.http.get<ProductosInterface>(`${this.api_url}/${id}`);
  }

  getProductoCompleto(id: number): Observable<ProductoCompletoInterface> {
    return this.http.get<ProductoCompletoInterface>(`${this.api_url}/${id}/completo`);
  }

  createProducto(producto: CrearProductoDtoInterface): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.api_url, producto, { 
      headers, 
      responseType: 'text' 
    });
  }

  updateProducto(id: number, producto: CrearProductoDtoInterface): Observable<string> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put(`${this.api_url}/${id}`, producto, { 
      headers, 
      responseType: 'text' 
    });
  }

  deleteProducto(id: number): Observable<string> {
    return this.http.delete(`${this.api_url}/${id}`, {
      responseType: 'text'
    });
  }

  getCostosFijos(productoId: number): Observable<CostoFijoInterface[]> {
    return this.http.get<CostoFijoInterface[]>(`${this.api_url}/${productoId}/costos-fijos`);
  }

  getInsumos(productoId: number): Observable<InsumosProductoInterface[]> {
    return this.http.get<InsumosProductoInterface[]>(`${this.api_url}/${productoId}/insumos`);
  }

}
