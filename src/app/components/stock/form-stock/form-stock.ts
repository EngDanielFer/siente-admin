import { Component, OnInit } from '@angular/core';
import { ProductosInterface } from '../../../interfaces/productos.interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../services/stock.service';
import { Subscription } from 'rxjs';
import { SharedStockService } from '../../../services/shared/shared-stock.service';
import { environment } from '../../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { InsumosFaltantesDialog } from '../../shared/insumos-faltantes-dialog/insumos-faltantes-dialog';
import { InsumosService } from '../../../services/insumos.service';
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-stock',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-stock.html',
  styleUrl: './form-stock.css',
})
export class FormStock implements OnInit {

  stockFormulario!: FormGroup;

  listaProductos: ProductosInterface[] = [];
  loadingProductos = false;
  productoSeleccionado: number = 0;
  enviando = false;
  loading = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private stockService: StockService,
    private sharedStockService: SharedStockService,
    private insumosService: InsumosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.initFormulario();
    this.cargarProductos();
  }

  initFormulario(): void {
    this.stockFormulario = this.formBuilder.group({
      id_producto: [0, [Validators.required, Validators.min(1)]],
      cantidad_producto: ['', [Validators.required, Validators.min(1)]]
    })
  }

  cargarProductos(): void {
    this.loadingProductos = true;
    this.httpClient.get<ProductosInterface[]>(`${environment.apiUrl}/api/siente/productos`)
      .subscribe({
        next: (response) => {
          this.listaProductos = response;
          this.loadingProductos = false;
        },
        error: (error) => {
          console.error('Error al cargar los productos:', error);
          this.loadingProductos = false;
          this.snackBar.open('Ha ocurrido un error al cargar los productos', 'Cerrar', {
            duration: 5000,
            panelClass: ['snack-error']
          });
        }
      });
  }

  guardarStock(): void {
    if (this.stockFormulario.invalid) {
      this.stockFormulario.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.enviando = true;
    const datos = this.stockFormulario.value;

    this.stockService.createStock(datos).subscribe({
      next: () => {
        this.snackBar.open("Stock agregado correctamente", "Cerrar", {
          duration: 3000,
          panelClass: ['snack-success']
        });
        this.stockFormulario.reset({ id_producto: 0, cantidad_producto: '' });
        this.sharedStockService.notificarCambios();
        this.enviando = false;
        this.loading = false;
      },
      error: (err) => {
        this.enviando = false;
        this.loading = false;

        const mensaje: string = err?.error?.message ?? err?.error?.mensaje ?? '';

        if (
          mensaje.toLowerCase().includes('insumo') ||
          mensaje.toLowerCase().includes('suficiente') ||
          mensaje.toLowerCase().includes('no hay insumos')
        ) {
          this.mostrarDialogoInsumosFaltantes(mensaje);
        } else {
          this.snackBar.open(
            mensaje || 'Error ala gregar stock', 'Cerrar', {
              duration: 5000, panelClass: ['snack-error']
            } 
          );
        }
      }
    });
  }

  private mostrarDialogoInsumosFaltantes(mensajeError: string): void {
    this.insumosService.getInsumos().subscribe({
      next: (insumos: InsumosInterface[]) => {
        const insumosFaltantes = insumos.filter(
          i => i.estado_insumo === "Agregar más insumo"
        );

        this.dialog.open(InsumosFaltantesDialog, {
          width: '540px',
          disableClose: false,
          data: {
            mensajeError,
            insumos: insumosFaltantes
          }
        });
      },
      error: () => {
        this.dialog.open(InsumosFaltantesDialog, {
          width: '540px',
          disableClose: false,
          data: {
            mensajeError,
            insumos: []
          }
        });
      }
    });
  }

  get idProductoInvalid(): boolean {
    const control = this.stockFormulario.get('id_producto');
    return !!(control && control.invalid && control.touched);
  }

  get cantidadProductoInvalid(): boolean {
    const control = this.stockFormulario.get('cantidad_producto');
    return !!(control && control.invalid && control.touched)
  }
}
