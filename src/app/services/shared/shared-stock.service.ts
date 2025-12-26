import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedStockService {
  private cambiosSubject = new Subject<void>();
  cambio$ = this.cambiosSubject.asObservable();

  notificarCambios() {
    this.cambiosSubject.next();
  }
  
}
