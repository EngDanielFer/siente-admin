import { Component, OnInit } from '@angular/core';
import { InsumosService } from '../../../services/insumos.service';
import { CommonModule } from '@angular/common';
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDeleteDialog } from './confirm-delete-dialog/confirm-delete-dialog';
import { SharedInsumoService } from '../../../services/shared/shared-insumo.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-lista-insumos',
  imports: [CommonModule],
  templateUrl: './lista-insumos.html',
  styleUrl: './lista-insumos.css',
})
export class ListaInsumos implements OnInit {

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
    private sharedInsumoService: SharedInsumoService
  ) { }

  ngOnInit(): void {
    this.listarInsumos();

    this.subscription = this.sharedInsumoService.cambios$.subscribe(() => {
      this.listarInsumos();
    });
  }

  listarInsumos() {
    this.loading = true;
    this.insumosService.getInsumos().subscribe({
      next: (data) => {
        this.insumos = data;
        this.calcularPaginacion();
        console.log(this.insumos);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener insumos: ', error);
        this.loading = false;
      }
    })
  }
  
  editarInsumo(insumo: InsumosInterface) {
    this.sharedInsumoService.setInsumoAEditar(insumo);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  borrarInsumo(id: number) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '400px',
      data: {
        titulo: 'Confirmar eliminación',
        mensaje: '¿Estás seguro de que deseas eliminar este insumo? Esta acción no se puede deshacer'
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.insumosService.deleteInsumo(id).subscribe(
          () => {
            this.listarInsumos();
          },
          error => {
            console.error('Error al eliminar insumo: ', error);
          }
        )
      }
    })

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
