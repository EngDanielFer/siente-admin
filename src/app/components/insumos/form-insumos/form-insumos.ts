import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { Subscription } from 'rxjs';
import { SharedInsumoService } from '../../../services/shared/shared-insumo.service';
import { CommonModule } from '@angular/common';
import { InsumosService } from '../../../services/insumos.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoWheelNumberDirective } from '../../../directives/no-wheel-number.directive';

@Component({
  selector: 'app-form-insumos',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NoWheelNumberDirective],
  templateUrl: './form-insumos.html',
  styleUrl: './form-insumos.css',
})
export class FormInsumos implements OnInit, OnDestroy {

  insumo: InsumosInterface = this.insumoVacio();

  cantidadOriginalTotal: number = 0;
  cantidadOriginalRestante: number = 0;

  mostrarFormulario = false;
  modoEdicion = false;
  loading = false;
  editandoPrecioManual = false;

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

          this.cantidadOriginalTotal = Number(insumo.cantidad_insumo_total ?? 0);
          this.cantidadOriginalRestante = Number(insumo.cantidad_insumo_restante ?? 0);

          this.insumo.cantidad_insumo_restante = this.cantidadOriginalRestante;
          this.insumo.cantidad_insumo_total = this.cantidadOriginalTotal;

          this.modoEdicion = true;
          this.editandoPrecioManual = false;
          this.sharedInsumoService.setMostrarFormulario(true);
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

  toggleEdicionPrecio(): void {
    this.editandoPrecioManual = !this.editandoPrecioManual;

    if (!this.editandoPrecioManual) {
      this.recalcularPrecio();
    }
  }


  onCantidadChange(): void {
    if (this.modoEdicion) {
      this.insumo.cantidad_insumo_total = Number(this.insumo.cantidad_insumo_restante) || 0;
    }

    if (!this.editandoPrecioManual) {
      this.recalcularPrecio();
    }
  }


  onPrecioManualChange(): void {
    if (this.editandoPrecioManual) {
      this.insumo.precio_por_g_ml = this.calcularPrecioPorUnidad();
    }
  }

  recalcularPrecio(): void {
    const precioUnitario = this.insumo.precio_por_g_ml ?? 0;
    const cantidad = this.insumo.cantidad_insumo_restante ?? 0;
    this.insumo.precio_insumo = precioUnitario * cantidad;
  }

  calcularPrecioPorUnidad(): number {
    const precio = this.insumo.precio_insumo ?? 0;
    const cantidad = this.insumo.cantidad_insumo_restante ?? 1;
    return cantidad > 0 ? precio / cantidad : 0;
  }

  onSubmit() {
    this.loading = true;

    this.insumo.cantidad_insumo_total = Number(this.insumo.cantidad_insumo_restante) || 0;

    if (this.modoEdicion) {
      if (this.editandoPrecioManual) {
        this.insumo.precio_por_g_ml = this.calcularPrecioPorUnidad();
      }

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
        cantidad_insumo_restante: this.insumo.cantidad_insumo_restante,
        proveedor_insumo: this.insumo.proveedor_insumo,
        precio_insumo: this.insumo.precio_insumo,
        cantidad_minima: this.insumo.cantidad_minima ?? null,
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
    this.editandoPrecioManual = false;
    this.cantidadOriginalTotal = 0;
    this.cantidadOriginalRestante = 0;
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
      estado_insumo: '',
      cantidad_minima: null,
    }
  }
}
