import { Component, OnDestroy, OnInit } from '@angular/core';
import { InsumosService } from '../../../services/insumos.service';
import { CommonModule } from '@angular/common';
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from './confirm-delete-dialog/confirm-delete-dialog';
import { SharedInsumoService } from '../../../services/shared/shared-insumo.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lista-insumos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-insumos.html',
  styleUrl: './lista-insumos.css',
})
export class ListaInsumos implements OnInit, OnDestroy {

  insumos: InsumosInterface[] = [];
  insumosPorPagina: InsumosInterface[] = [];

  paginaActual: number = 1;
  itemInsumosPorPagina: number = 10;
  paginasTotales: number = 0;

  loading: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private insumosService: InsumosService,
    private dialog: MatDialog,
    private sharedInsumoService: SharedInsumoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.listarInsumos();

    this.subscription = this.sharedInsumoService.cambios$.subscribe(() => {
      this.listarInsumos();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  listarInsumos() {
    this.loading = true;
    this.insumosService.getInsumos().subscribe({
      next: (data) => {
        this.insumos = data;
        this.calcularPaginacion();
        this.loading = false;
      },
      error: (error) => {
        this.mostrarError('Error al cargar los insumos');
        this.loading = false;
      }
    })
  }

  editarInsumo(insumo: InsumosInterface) {
    this.sharedInsumoService.setInsumoAEditar(insumo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  confirmarBorrado(insumo: InsumosInterface): void {
    if (insumo.id === undefined) {
      this.mostrarError('No se puede eliminar, el insumo no tiene ID');
      return;
    }

    const id = insumo.id;

    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '380px',
      data: { nombre: insumo.nombre_insumo }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) this.borrarInsumo(id);
    });
  }

  private borrarInsumo(id: number) {
    this.insumosService.deleteInsumo(id).subscribe({
      next: () => {
        this.mostrarExito('Insumo eliminado correctamente');
        this.listarInsumos();
        this.sharedInsumoService.notificarCambios();
      },
      error: err => {
        const msg = err.status === 404
          ? 'El insumo no existe'
          : 'Error al eliminar el insumo';
        this.mostrarError(msg);
      }
    })
  }


  private mostrarExito(msg: string): void {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 3000,
      panelClass: ['snack-success']
    });
  }

  private mostrarError(msg: string): void {
    this.snackBar.open(msg, 'Cerrar', {
      duration: 4000,
      panelClass: ['snack-error']
    });
  }

  calcularPaginacion() {
    this.paginasTotales = Math.ceil(this.insumos.length / this.itemInsumosPorPagina);
    this.actualizarInsumosPorPagina();
  }

  actualizarInsumosPorPagina() {
    const inicio = (this.paginaActual - 1) * this.itemInsumosPorPagina;
    const fin = inicio + this.itemInsumosPorPagina;
    this.insumosPorPagina = this.insumos.slice(inicio, fin);
  }

  cambiarPagina(paginaNueva: number) {
    if (paginaNueva >= 1 && paginaNueva <= this.paginasTotales) {
      this.paginaActual = paginaNueva;
      this.actualizarInsumosPorPagina();
    }
  }

  calcularFin(): number {
    return Math.min(this.paginaActual * this.itemInsumosPorPagina, this.insumos.length);
  }

  paginaAnterior() {
    this.cambiarPagina(this.paginaActual - 1);
  }

  paginaSiguiente() {
    this.cambiarPagina(this.paginaActual + 1);
  }

  get numPaginas(): number[] {
    return Array.from({ length: this.paginasTotales }, (_, i) => i + 1);
  }

}
