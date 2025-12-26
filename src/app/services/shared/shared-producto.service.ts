import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ProductoCompletoInterface } from '../../interfaces/producto-completo.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedProductoService {
  private cambiosSubject = new Subject<void>();
  cambio$ = this.cambiosSubject.asObservable();

  private productoSeleccionadoSource = new BehaviorSubject<ProductoCompletoInterface | null>(null);
  productoSeleccionado$ = this.productoSeleccionadoSource.asObservable();

  private mostrarFormularioSubject = new BehaviorSubject<boolean>(false);
  mostrarFormulario$ = this.mostrarFormularioSubject.asObservable();

  constructor() { }

  notificarCambios() {
    this.cambiosSubject.next();
  }

  seleccionarProducto(producto: ProductoCompletoInterface): void {
    this.productoSeleccionadoSource.next(producto);
    this.mostrarFormularioSubject.next(true);
  }

  limpiarSeleccion(): void {
    this.productoSeleccionadoSource.next(null);
  }

  setMostrarFormulario(show: boolean): void {
    this.mostrarFormularioSubject.next(show);
  }
}
