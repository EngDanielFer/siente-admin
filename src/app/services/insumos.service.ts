import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsumosInterface } from '../interfaces/insumos.interface';

@Injectable({
  providedIn: 'root',
})
export class InsumosService {

  private api_url: string = 'http://localhost:8000/api/siente/insumos';

  constructor(private http: HttpClient) { }

  getInsumos(): Observable<InsumosInterface[]> {
    return this.http.get<InsumosInterface[]>(this.api_url);
  }

  getInsumoById(id: number): Observable<InsumosInterface> {
    return this.http.get<InsumosInterface>(`${this.api_url}/${id}`);
  }

  createInsumo(insumo: InsumosInterface): Observable<InsumosInterface> {
    return this.http.post<InsumosInterface>(this.api_url, insumo);
  }

  deleteInsumo(id: number): Observable<any> {
    return this.http.delete<any>(this.api_url + `/${id}`);
  }

  updateInsumo(id: number, insumo: InsumosInterface): Observable<InsumosInterface> {
    return this.http.put<InsumosInterface>(`${this.api_url}/${id}`, insumo);
  }

}
