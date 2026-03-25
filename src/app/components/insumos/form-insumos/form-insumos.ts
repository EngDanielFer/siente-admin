import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { Subscription } from 'rxjs';
import { SharedInsumoService } from '../../../services/shared/shared-insumo.service';
import { CommonModule } from '@angular/common';
import { InsumosService } from '../../../services/insumos.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-insumos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-insumos.html',
  styleUrl: './form-insumos.css',
})
export class FormInsumos implements OnInit, OnDestroy {

  insumo: InsumosInterface = this.insumoVacio();

  mostrarFormulario = false;

  modoEdicion = false;
  loading = false;
  private subscription = new Subscription();

  constructor(
    private insumosService: InsumosService,
    private sharedInsumoService: SharedInsumoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.subscription = this.sharedInsumoService.insumoAEditar$.subscribe(
      insumo => {
        if (insumo) {
          this.insumo = { ...insumo };
          this.modoEdicion = true;
          this.recalcularPrecio();
        } else {
          this.limpiarFormulario();
        }
      }
    );

    this.subscription.add(
      this.sharedInsumoService.mostrarFormulario$.subscribe(mostrar => {
        this.mostrarFormulario = mostrar;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onCantidadChange(): void {
    if (this.modoEdicion) {
      this.recalcularPrecio();
    }
  }

  recalcularPrecio(): void {
    const precioUnitario = this.insumo.precio_por_g_ml ?? 0;
    const cantidad = this.insumo.cantidad_insumo_total ?? 0;
    this.insumo.precio_insumo = precioUnitario * cantidad;
  }

  onSubmit() {
    this.loading = true;

    if (this.modoEdicion) {
      this.insumosService.updateInsumo(this.insumo.id!, this.insumo).subscribe({
        next: () => {
          this.snackBar.open('Insumo actualizado correctamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.limpiarFormulario();
          this.mostrarFormulario = false;
          this.sharedInsumoService.notificarCambios();
          this.loading = false;
        },
        error: err => {
          const msg = err.error?.mensaje || 'Error al actualizar el insumo';
          this.snackBar.open(msg, 'Cerrar', {
            duration: 4000,
            panelClass: ['snack-error']
          });
          this.loading = false;
        }
      });
    } else {
      const nuevoInsumo: InsumosInterface = {
        nombre_insumo: this.insumo.nombre_insumo,
        cantidad_insumo_total: this.insumo.cantidad_insumo_total,
        proveedor_insumo: this.insumo.proveedor_insumo,
        precio_insumo: this.insumo.precio_insumo
      };

      this.insumosService.createInsumo(nuevoInsumo).subscribe({
        next: res => {
          this.snackBar.open(`Insumo "${res.nombre_insumo}" creado correctamente`, 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
          this.limpiarFormulario();
          this.sharedInsumoService.notificarCambios();
          this.loading = false;
        },
        error: err => {
          const msg = err.error?.mensaje || 'Error al crear el insumo';
          this.snackBar.open(msg, 'Cerrar', {
            duration: 4000,
            panelClass: ['snack-error']
          });
          this.loading = false;
        }
      });
    }
  }

  limpiarFormulario() {
    this.insumo = this.insumoVacio();
    this.modoEdicion = false;
    this.sharedInsumoService.clearInsumoAEditar();
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.sharedInsumoService.setMostrarFormulario(this.mostrarFormulario);

    if (!this.mostrarFormulario) {
      this.limpiarFormulario();
    }
  }

  private insumoVacio(): InsumosInterface {
    return {
      nombre_insumo: '',
      cantidad_insumo_total: 0,
      cantidad_insumo_restante: 0,
      proveedor_insumo: '',
      precio_insumo: 0,
      precio_por_g_ml: 0,
      estado_insumo: ''
    }
  }
}
