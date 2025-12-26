import { Component, OnInit } from '@angular/core';
import { StockInterface } from '../../../interfaces/stock.interface';
import { StockService } from '../../../services/stock.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { SharedStockService } from '../../../services/shared/shared-stock.service';

@Component({
  selector: 'app-lista-stock',
  imports: [CommonModule],
  templateUrl: './lista-stock.html',
  styleUrl: './lista-stock.css',
})
export class ListaStock implements OnInit {

  stocks: StockInterface[] = [];
  stocksPorPagina: StockInterface[] = [];

  paginaActual: number = 1;
  itemStocksPorPagina: number = 10;
  paginasTotales: number = 0;

  loading: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private stockService: StockService,
    private sharedStockService: SharedStockService
  ) { }

  ngOnInit(): void {
    this.listarStock();

    this.subscription = this.sharedStockService.cambio$.subscribe(() => {
      this.listarStock();
    });
  }

  listarStock() {
    this.loading = true;
    this.stockService.getStock().subscribe({
      next: (data) => {
        this.stocks = data;
        this.calcularPaginacion();
        console.log(this.stocks);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al obtener stock: ', error);
        this.loading = false;
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
