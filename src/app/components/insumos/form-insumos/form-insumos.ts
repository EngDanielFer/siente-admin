import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { Subscription } from 'rxjs';
import { SharedInsumoService } from '../../../services/shared/shared-insumo.service';
import { CommonModule } from '@angular/common';
import { InsumosService } from '../../../services/insumos.service';

@Component({
  selector: 'app-form-insumos',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-insumos.html',
  styleUrl: './form-insumos.css',
})
export class FormInsumos implements OnInit, OnDestroy {

  insumo: InsumosInterface = {
    id: 0,
    nombre_insumo: '',
    cantidad_insumo_total: 0,
    cantidad_insumo_restante: 0,
    proveedor_insumo: '',
    precio_insumo: 0,
    precio_por_g_ml: 0,
    estado_insumo: ''
  }

  mostrarFormulario: boolean = false;

  modoEdicion: boolean = false;
  private subscription: Subscription = new Subscription();

  constructor(
    private insumosService: InsumosService,
    private sharedInsumoService: SharedInsumoService
  ) { }

  ngOnInit(): void {
    this.subscription = this.sharedInsumoService.insumoAEditar$.subscribe(
      (insumo) => {
        if (insumo) {
          this.insumo = {...insumo};
          this.modoEdicion = true;
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

  onSubmit() {
    if (this.modoEdicion) {
      console.log('Actualizando insumo: ', this.insumo);

      this.insumosService.updateInsumo(this.insumo.id!, this.insumo).subscribe({
        next: (res) => {
          console.log("Se ha actualizado el insumo: ", res.id);
          this.limpiarFormulario();
          this.sharedInsumoService.notificarCambios();
        },
        error: (error) => {
          console.error('Error al actualizar insumo: ', error);
        }
      });
    } else {
      const nuevoInsumo = {
        nombre_insumo: this.insumo.nombre_insumo,
        cantidad_insumo_total: this.insumo.cantidad_insumo_total,
        proveedor_insumo: this.insumo.proveedor_insumo,
        precio_insumo: this.insumo.precio_insumo
      };
      
      console.log('Creando insumo: ', this.insumo);
      this.insumosService.createInsumo(nuevoInsumo).subscribe(
        res => {
          console.log("Se ha creado el insumo con el id: ", res.id);
          this.limpiarFormulario();
          this.sharedInsumoService.notificarCambios();
        },
        error => console.error("Error al crear insumo: ", error)
      )
    }
  }

  limpiarFormulario() {
    this.insumo = {
      id: 0,
      nombre_insumo: '',
      cantidad_insumo_total: 0,
      cantidad_insumo_restante: 0,
      proveedor_insumo: '',
      precio_insumo: 0,
      precio_por_g_ml: 0,
      estado_insumo: ''
    };
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
}
