import { Component, OnInit } from '@angular/core';
import { GananciasInterface } from '../../../interfaces/ganancias.interface';
import { GananciasService } from '../../../services/ganancias.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabla-ganancias',
  imports: [CommonModule],
  templateUrl: './tabla-ganancias.html',
  styleUrl: './tabla-ganancias.css',
})
export class TablaGanancias implements OnInit {

  ganancias: GananciasInterface[] = [];
  gananciasPorPagina: GananciasInterface[] = [];

  paginaActual: number = 1;
  itemGananciasPorPagina: number = 10;
  paginasTotales: number = 0;

  loading: boolean = false;

  totalVentas: number = 0;
  totalGanancias: number = 0;

  constructor(
    private gananciasService: GananciasService
  ) { }

  ngOnInit(): void {
    this.listarGanancias();
  }

  listarGanancias() {
    this.loading = true;
    this.gananciasService.getGanancias().subscribe({
      next: (data) => {
        this.ganancias = data;
        this.calcularTotalVentas();
        this.calcularTotalGanancias();
        this.calcularPaginacion();
        console.log(this.ganancias);
        this.loading= false;
      },
      error: (error) => {
        console.error('Error al obtener ganancias: ', error);
        this.loading = false;
      }
    });
  }

  calcularPaginacion() {
    this.paginasTotales = Math.ceil(this.ganancias.length / this.itemGananciasPorPagina);
    this.actualizarGananciasPorPagina();
  }

  actualizarGananciasPorPagina() {
    const inicio = (this.paginaActual - 1) *this.itemGananciasPorPagina;
    const fin = inicio + this.itemGananciasPorPagina;
    this.gananciasPorPagina = this.ganancias.slice(inicio, fin);
  }

  cambiarPagina(paginaNueva: number) {
    if (paginaNueva >= 1 && paginaNueva <= this.paginasTotales) {
      this.paginaActual = paginaNueva;
      this.actualizarGananciasPorPagina();
    }
  }

  calcularFin(): number {
    return Math.min(this.paginaActual * this.itemGananciasPorPagina, this.ganancias.length);
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

  calcularTotalVentas() {
    this.totalVentas = this.ganancias.reduce(
      (total, item) => total + Number(item.precio_total), 0
    );
  }

  calcularTotalGanancias() {
    this.totalGanancias = this.ganancias.reduce(
      (total, item) => total + Number(item.ganancia_total),
      0
    );
  }

}
