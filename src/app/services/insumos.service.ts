import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InsumosInterface } from '../interfaces/insumos.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class InsumosService {

  private readonly apiUrl = `${environment.apiUrl}/api/siente/insumos`;

  constructor(private http: HttpClient) { }

  getInsumos(): Observable<InsumosInterface[]> {
    return this.http.get<InsumosInterface[]>(this.apiUrl);
  }

  getInsumoById(id: number): Observable<InsumosInterface> {
    return this.http.get<InsumosInterface>(`${this.apiUrl}/${id}`);
  }

  createInsumo(insumo: InsumosInterface): Observable<InsumosInterface> {
    return this.http.post<InsumosInterface>(this.apiUrl, insumo);
  }

  deleteInsumo(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  updateInsumo(id: number, insumo: InsumosInterface): Observable<InsumosInterface> {
    return this.http.put<InsumosInterface>(`${this.apiUrl}/${id}`, insumo);
  }

}
