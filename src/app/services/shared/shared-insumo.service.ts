import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { InsumosInterface } from '../../interfaces/insumos.interface';

@Injectable({
  providedIn: 'root',
})
export class SharedInsumoService {
  private insumoAEditarSub = new BehaviorSubject<InsumosInterface | null>(null);
  insumoAEditar$ = this.insumoAEditarSub.asObservable();

  private cambiosSubject = new Subject<void>();
  cambios$ = this.cambiosSubject.asObservable();

  private mostrarFormularioSubject = new BehaviorSubject<boolean>(false);
  mostrarFormulario$ = this.mostrarFormularioSubject.asObservable();

  setInsumoAEditar(insumo: InsumosInterface) {
    this.insumoAEditarSub.next(insumo);
    this.mostrarFormularioSubject.next(true);
  }

  clearInsumoAEditar() {
    this.insumoAEditarSub.next(null);
  }

  notificarCambios() {
    this.cambiosSubject.next();
  }

  setMostrarFormulario(show: boolean) {
    this.mostrarFormularioSubject.next(show);
  }
}
