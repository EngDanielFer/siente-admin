import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductosInterface } from '../../../interfaces/productos.interface';
import { ProductosService } from '../../../services/productos.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SharedProductoService } from '../../../services/shared/shared-producto.service';
import { CostosFijosProductos } from './costos-fijos-productos/costos-fijos-productos';
import { InsumosProductos } from './insumos-productos/insumos-productos';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmDeleteDialog } from '../../insumos/lista-insumos/confirm-delete-dialog/confirm-delete-dialog';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, CostosFijosProductos, InsumosProductos],
  templateUrl: './lista-productos.html',
  styleUrl: './lista-productos.css',
})
export class ListaProductos implements OnInit, OnDestroy {

  productos: ProductosInterface[] = [];
  productosPorPagina: ProductosInterface[] = [];

  paginaActual: number = 1;
  itemProductosPorPagina: number = 10;
  paginasTotales: number = 0;

  loading: boolean = false;
  loadingDetalles: { [key: number]: boolean } = {};

  mostrarCostosFijos: boolean = false;
  mostrarInsumos: boolean = false;
  productoSelecId: number | null = null;

  private subscription: Subscription = new Subscription();

  constructor(
    private productosService: ProductosService,
    private sanitizer: DomSanitizer,
    private sharedProductoService: SharedProductoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.listarProductos();
    this.subscription.add(
      this.sharedProductoService.cambio$.subscribe(() => this.listarProductos())
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  listarProductos(): void {
    this.loading = true;
    this.productosService.getProductos().subscribe({
      next: data => {
        this.productos = data;
        this.calcularPaginacion();
        this.loading = false;
      },
      error: (error) => {
        this.snackBar.open('Error al cargar los productos', 'Cerrar', { duration: 4000 });
        this.loading = false;
      }
    });
  }

  editarProducto(id: number): void {
    this.loadingDetalles[id] = true;

    this.productosService.getProductoCompleto(id).subscribe({
      next: producto => {
        this.sharedProductoService.seleccionarProducto(producto);
        this.loadingDetalles[id] = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.snackBar.open('Error al cargar el producto', 'Cerrar', { duration: 4000 });
        this.loadingDetalles[id] = false;
      }
    });
  }

  verCostosFijos(id: number): void {
    this.productoSelecId = id;
    this.mostrarCostosFijos = true;
    this.mostrarInsumos = false;
  }

  verInsumos(id: number): void {
    this.productoSelecId = id;
    this.mostrarInsumos = true;
    this.mostrarCostosFijos = false;
  }

  cerrarModal(): void {
    this.mostrarCostosFijos = false;
    this.mostrarInsumos = false;
    this.productoSelecId = null;
  }

  confirmarEliminar(id: number): void {
    const producto = this.productos.find(p => p.id === id);
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '380px',
      data: { nombre: producto?.nombre_producto ?? `ID ${id}` }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) this.eliminarProducto(id);
    });
  }

  private eliminarProducto(id: number): void {
    this.loadingDetalles[id] = true;

    this.productosService.deleteProducto(id).subscribe({
      next: () => {
        this.snackBar.open('Producto eliminado', 'Cerrar', {
          duration: 3000,
          panelClass: ['snack-success']
        });
        this.listarProductos();
        this.sharedProductoService.notificarCambios();
        this.loadingDetalles[id] = false;
      },
      error: err => {
        const msg = err.status === 404
          ? 'El producto no existe'
          : 'Error al eliminar el producto';
        this.snackBar.open(msg, 'Cerrar', { duration: 4000, panelClass: ['snack-error'] });
        this.loadingDetalles[id] = false;
      }
    })
  }

  getImageUrl(imagenProducto: any): SafeUrl {
    if (!imagenProducto) {
      return '';
    }

    if (typeof imagenProducto === 'string') {
      if (imagenProducto.startsWith('http') || imagenProducto.startsWith('data')) {
        return this.sanitizer.bypassSecurityTrustUrl(imagenProducto);
      }
      return this.sanitizer.bypassSecurityTrustUrl(`data:image/jpeg;base64,${imagenProducto}`);
    }

    if (imagenProducto instanceof Blob) {
      return this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imagenProducto));
    }

    return '';
  }

  calcularPaginacion(): void {
    this.paginasTotales = Math.ceil(this.productos.length / this.itemProductosPorPagina);
    this.actualizarProductosPorPagina();
  }

  actualizarProductosPorPagina(): void {
    const inicio = (this.paginaActual - 1) * this.itemProductosPorPagina;
    const fin = inicio + this.itemProductosPorPagina;
    this.productosPorPagina = this.productos.slice(inicio, fin);
  }

  cambiarPagina(paginaNueva: number): void {
    if (paginaNueva >= 1 && paginaNueva <= this.paginasTotales) {
      this.paginaActual = paginaNueva;
      this.actualizarProductosPorPagina();
    }
  }

  calcularFin(): number {
    return Math.min(this.paginaActual * this.itemProductosPorPagina, this.productos.length);
  }

  paginaAnterior(): void {
    this.cambiarPagina(this.paginaActual - 1);
  }

  paginaSiguiente(): void {
    this.cambiarPagina(this.paginaActual + 1);
  }

  get numPaginas(): number[] {
    return Array.from({ length: this.paginasTotales }, (_, i) => i + 1);
  }

}
