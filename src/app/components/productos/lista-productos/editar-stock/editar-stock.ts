import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../../../services/productos.service';
import { StockService } from '../../../../services/stock.service';
import { ProductoCompletoInterface } from '../../../../interfaces/producto-completo.interface';

export interface InsumoInsuficiente {
  nombre_insumo: string;
  cantidad_por_unidad?: number;
  cantidad_necesaria: number;
  cantidad_disponible: number;
  cantidad_faltante?: number;
  cantidad_minima?: number | null;
}
@Component({
  selector: 'app-editar-stock',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-stock.html',
  styleUrl: './editar-stock.css',
  encapsulation: ViewEncapsulation.None,
})
export class EditarStock implements OnInit {
  @Input() productoId!: number;
  @Input() stockActual!: number;
  @Input() nombreProducto!: string;
  @Output() cerrar = new EventEmitter<void>();
  @Output() stockActualizado = new EventEmitter<void>();

  nuevoStock: number | null = null;
  diferencia: number = 0;
  loading: boolean = false;
  loadingProducto: boolean = false;
  error: string = '';
  submitted: boolean = false;

  insumosInsuficientes: InsumoInsuficiente[] = [];

  productoCompleto: ProductoCompletoInterface | null = null;

  constructor(
    private productosService: ProductosService,
    private stockService: StockService
  ) { }

  ngOnInit(): void {
    this.nuevoStock = this.stockActual;
    this.cargarProductoCompleto();
  }

  cargarProductoCompleto(): void {
    this.loadingProducto = true;
    this.productosService.getProductoCompleto(this.productoId).subscribe({
      next: (producto) => {
        this.productoCompleto = producto;
        this.loadingProducto = false;
      },
      error: () => {
        this.error = 'No se pudo cargar la información del producto';
        this.loadingProducto = false;
      }
    });
  }

  calcularDiferencia(): void {
    if (this.nuevoStock !== null && this.nuevoStock !== undefined) {
      this.diferencia = this.nuevoStock - this.stockActual;
    } else {
      this.diferencia = 0;
    }
  }

  get descripcionCambio(): string {
    if (this.diferencia === 0) {
      return '';
    }
    if (this.diferencia > 0) {
      return `Se aumentará el stock en ${this.diferencia} unidad(es). Los insumos de ${this.diferencia} producto(s) serán DESCONTADOS del inventario.`;
    }
    return `Se reducirá el stock en ${Math.abs(this.diferencia)} unidad(es). Los insumos utilizados en la producción NO serán devueltos.`;
  }

  get claseAlerta(): string {
    if (this.diferencia === 0) {
      return 'alert-secondary';
    }
    if (this.diferencia > 0) {
      return 'alert-warning';
    }
    return 'alert-info'
  }

  get iconoAlerta(): string {
    if (this.diferencia === 0) {
      return 'bi-dash-circle';
    }
    if (this.diferencia > 0) {
      return 'bi-arrow-down-circle';
    }
    return 'bi-arrow-up-circle';
  }

  onStockChange(): void {
    this.calcularDiferencia();
    this.error = '';
    this.insumosInsuficientes = [];
  }

  guardarCambio(): void {
    this.submitted = true;

    if (this.nuevoStock === null || this.nuevoStock === undefined || this.nuevoStock < 0) {
      return;
    }

    if (this.diferencia === 0) {
      this.cerrar.emit();
      return;
    }

    this.loading = true;
    this.error = ''
    this.insumosInsuficientes = [];

    this.stockService.updateStock(this.productoId, {
      cantidad_producto: this.nuevoStock,
      diferencia: this.diferencia,
    }).subscribe({
      next: () => {
        this.loading = false;
        this.stockActualizado.emit();
        this.cerrar.emit();
      },
      error: (err) => {
        this.loading = false;
        this.insumosInsuficientes = [];

        if (err.status === 200 || err.status === 201) {
          this.stockActualizado.emit();
          this.cerrar.emit();
          return;
        }
        if (err.status === 422) {
          this.error = err.error?.mensaje || err.error?.message
            || 'Insumos insuficientes para realizar este ajuste.';
          this.insumosInsuficientes = err.error?.insumos ?? [];
        } else if (err.error?.mensaje) {
          this.error = err.error.mensaje;
        } else if (err.error?.message) {
          this.error = err.error.message;
        } else if (err.status === 400) {
          this.error = 'Datos inválidos. Verifique el stock ingresado.';
        } else {
          this.error = 'Error al actualizar el stock. Intente nuevamente.';
        }
      },
    });
  }
}
