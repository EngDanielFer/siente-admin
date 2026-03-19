import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedFacturaService {
  private cambiosSubject = new Subject<void>();
  cambios$ = this.cambiosSubject.asObservable();

  private mostrarFormFacturaSubject = new BehaviorSubject<boolean>(false);
  mostrarFormFactura$ = this.mostrarFormFacturaSubject.asObservable();

  notificarCambios() {
    this.cambiosSubject.next();
  }

  setMostrarFormFactura(show: boolean) {
    this.mostrarFormFacturaSubject.next(show);
  }
  
}
