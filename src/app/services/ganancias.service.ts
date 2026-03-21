import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GananciasService {

  private readonly apiUrl = `${environment.apiUrl}/api/siente/ganancias`

  constructor(private http: HttpClient) { }

  getGanancias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
}
