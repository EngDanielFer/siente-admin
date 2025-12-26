import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductosInterface } from '../../../interfaces/productos.interface';
import { ProductosService } from '../../../services/productos.service';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { SharedProductoService } from '../../../services/shared/shared-producto.service';
import { CostosFijosProductos } from './costos-fijos-productos/costos-fijos-productos';
import { InsumosProductos } from './insumos-productos/insumos-productos';

@Component({
  selector: 'app-lista-productos',
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
    private sharedProductoService: SharedProductoService
  ) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.listarProductos();

    this.subscription = this.sharedProductoService.cambio$.subscribe(() => {
      this.listarProductos();
    })
  }

  listarProductos() {
    this.loading = true;
    this.productosService.getProductos().subscribe({
      next: (data) => {
        this.productos = data;
        this.calcularPaginacion();
        console.log(this.productos);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener productos: ', error);
        this.loading = false;
      }
    });
  }

  editarProducto(id: number) {
    this.loadingDetalles[id] = true;

    this.productosService.getProductoCompleto(id).subscribe({
      next: (producto) => {
        this.sharedProductoService.seleccionarProducto(producto);
        this.loadingDetalles[id] = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error) => {
        console.error('Error al cargar detalles del producto:', error);
        alert('Error al cargar los detalles del producto');
        this.loadingDetalles[id] = false;
      }
    });
  }

  verCostosFijos(id: number) {
    this.productoSelecId = id;
    this.mostrarCostosFijos = true;
    this.mostrarInsumos = false;
  }

  verInsumos(id: number) {
    this.productoSelecId = id;
    this.mostrarInsumos = true;
    this.mostrarCostosFijos = false;
  }

  cerrarModal() {
    this.mostrarCostosFijos = false;
    this.mostrarInsumos = false;
    this.productoSelecId = null;
  }

  eliminarProducto(id: number): void {
    const producto = this.productos.find(p => p.id === id);
    const mensaje = `¿Está seguro de eliminar este producto: ${producto?.nombre_producto}? Esta acción no se puede deshacer`;
    if (confirm(mensaje)) {
      this.loadingDetalles[id] = true;

      this.productosService.deleteProducto(id).subscribe({
        next: () => {
          alert("Se ha eliminado el producto");
          this.listarProductos();
          this.sharedProductoService.notificarCambios();
          this.loadingDetalles[id] = false;
        },
        error: (error) => {
          console.error("Ha ocurrido un error al eliminar el producto:", error);
          let mensaje = "Ha ocurrido un error al eliminar el producto";

          if (error.status === 404) {
            mensaje = 'El producto no existe';
          } else if (error.status === 500) {
            mensaje = 'Error del servidor al eliminar el producto';
          }

          alert(mensaje);
          this.loadingDetalles[id] = false;
        }
      })
    }
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
      const objectURL = URL.createObjectURL(imagenProducto);
      return this.sanitizer.bypassSecurityTrustUrl(objectURL);
    }

    return '';
  }

  calcularPaginacion() {
    this.paginasTotales = Math.ceil(this.productos.length / this.itemProductosPorPagina);
    this.actualizarProductosPorPagina();
  }

  actualizarProductosPorPagina() {
    const inicio = (this.paginaActual - 1) * this.itemProductosPorPagina;
    const fin = inicio + this.itemProductosPorPagina;
    this.productosPorPagina = this.productos.slice(inicio, fin);
  }

  cambiarPagina(paginaNueva: number) {
    if (paginaNueva >= 1 && paginaNueva <= this.paginasTotales) {
      this.paginaActual = paginaNueva;
      this.actualizarProductosPorPagina();
    }
  }

  calcularFin(): number {
    return Math.min(this.paginaActual * this.itemProductosPorPagina, this.productos.length);
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
