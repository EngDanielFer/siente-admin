import { Component, OnInit } from '@angular/core';
import { StockBajoInterface, StockInterface } from '../../../interfaces/stock.interface';
import { StockService } from '../../../services/stock.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SharedStockService } from '../../../services/shared/shared-stock.service';

@Component({
  selector: 'app-lista-stock',
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-stock.html',
  styleUrl: './lista-stock.css',
})
export class ListaStock implements OnInit {

  stocks: StockInterface[] = [];
  stocksFiltrados: StockInterface[] = [];
  stocksPorPagina: StockInterface[] = [];

  stocksBajos: StockBajoInterface[] = [];

  terminoBusqueda: string = '';

  paginaActual: number = 1;
  itemStocksPorPagina: number = 10;
  paginasTotales: number = 0;

  loading: boolean = false;
  loadingEliminar: { [key: number]: boolean } = {};

  private subscription: Subscription = new Subscription();

  constructor(
    private stockService: StockService,
    private sharedStockService: SharedStockService
  ) { }

  ngOnInit(): void {
    this.listarStock();
    this.cargarStocksBajos();

    this.subscription = this.sharedStockService.cambio$.subscribe(() => {
      this.listarStock();
      this.cargarStocksBajos();
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


  listarStock() {
    this.loading = true;
    this.stockService.getStock().subscribe({
      next: (data) => {
        this.stocks = data;
        this.aplicarFiltro();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener stock: ', error);
        this.loading = false;
      }
    })
  }

  cargarStocksBajos(): void {
    this.stockService.getLowStock().subscribe({
      next: (data) => {
        this.stocksBajos = data;
      },
      error: (err) => {
        console.error('Error al cargar alertas de stock', err);
      }
    });
  }

  onBusqueda(): void {
    this.paginaActual = 1;
    this.aplicarFiltro();
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.paginaActual = 1;
    this.aplicarFiltro();
  }

  private aplicarFiltro(): void {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    if (!termino) {
      this.stocksFiltrados = [...this.stocks];
    } else {
      this.stocksFiltrados = this.stocks.filter(s =>
        s.nombre_producto.toLowerCase().includes(termino) ||
        String(s.id_producto).includes(termino)
      );
    }
    this.calcularPaginacion();
  }

  eliminarLote(idProductoStock: number): void {
    if (!confirm('¿Está seguro de que desea eliminar este lote vacío?')) return;

    this.loadingEliminar[idProductoStock] = true;

    this.stockService.deleteStockLote(idProductoStock).subscribe({
      next: () => {
        this.loadingEliminar[idProductoStock] = false;
        this.listarStock();
      },
      error: (err) => {
        this.loadingEliminar[idProductoStock] = false;
        const msg = err?.error?.mensaje ?? 'Error al eliminar el lote';
        alert(msg);
      }
    })
  }

  calcularPaginacion() {
    this.paginasTotales = Math.ceil(this.stocks.length / this.itemStocksPorPagina);
    this.actualizarStocksPorPagina();
  }

  actualizarStocksPorPagina() {
    const inicio = (this.paginaActual - 1) * this.itemStocksPorPagina;
    const fin = inicio + this.itemStocksPorPagina;
    this.stocksPorPagina = this.stocks.slice(inicio, fin);
  }

  cambiarPagina(paginaNueva: number) {
    if (paginaNueva >= 1 && paginaNueva <= this.paginasTotales) {
      this.paginaActual = paginaNueva;
      this.actualizarStocksPorPagina();
    }
  }

  calcularFin(): number {
    return Math.min(this.paginaActual + this.itemStocksPorPagina, this.stocks.length);
  }

  paginaAnterior() {
    this.cambiarPagina(this.paginaActual - 1);
  }

  paginaSiguiente() {
    this.cambiarPagina(this.paginaActual + 1);
  }

  get numPaginas(): number[] {
    return Array.from({ length: this.paginasTotales }, (_, i) => i + 1)
  }

}
