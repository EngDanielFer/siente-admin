import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegistroRequest {
  username: string;
  password: string;
  nombre: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  tipo: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly TOKEN_KEY = 'siente_token';
  private readonly USER_KEY = 'siente_user';
  private readonly apiUrl = `${environment.apiUrl}/api/auth`;

  isLoggedIn = signal<boolean>(this.hayTokenValido());

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(res => {
        localStorage.setItem(this.TOKEN_KEY, res.token);
        localStorage.setItem(this.USER_KEY, res.username);
        this.isLoggedIn.set(true);
      })
    );
  }

  registro(datos: RegistroRequest): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.apiUrl}/registro`, datos);
  }

  logout(): void {
    this.limpiarSesion();
    this.router.navigate(['/login']);
  }

  estaAutenticado(): boolean {
    if (this.hayTokenValido()) {
      return true;
    }
    this.limpiarSesion();
    return false;
  }

  private limpiarSesion(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUsername(): string | null {
    return localStorage.getItem(this.USER_KEY);
  }

  private hayTokenValido(): boolean {
    const token = this.getToken();
    return !!token && !this.tokenExpirado(token);
  }

  private tokenExpirado(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        return true;
      }
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(base64));
      if (!payload.exp) {
        return false;
      }
      return payload.exp * 1000 <= Date.now();
    } catch (error) {
      return true;
    }
  }
}
