import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GananciasInterface } from '../interfaces/ganancias.interface';

@Injectable({
  providedIn: 'root',
})
export class GananciasService {

  private api_url: string = "http://localhost:8000/api/siente/ganancias"

  constructor(private http: HttpClient) { }

  getGanancias(): Observable<GananciasInterface[]> {
    return this.http.get<GananciasInterface[]>(this.api_url);
  }
  
}
