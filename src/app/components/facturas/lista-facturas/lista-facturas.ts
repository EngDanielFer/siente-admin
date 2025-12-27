import { Component, OnInit } from '@angular/core';
import { FacturasInterface } from '../../../interfaces/facturas.interface';
import { FacturaCompletaInterface } from '../../../interfaces/factura-completa.interface';
import { FacturasService } from '../../../services/facturas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-facturas',
  imports: [CommonModule],
  templateUrl: './lista-facturas.html',
  styleUrl: './lista-facturas.css',
})
export class ListaFacturas implements OnInit {

  facturas: FacturasInterface[] = [];
  facturasPorPagina: FacturasInterface[] = [];

  paginaActual = 1;
  itemsPorPagina = 10;
  paginasTotales = 0;

  loading = false;

  mostrarModal = false;
  facturaSeleccionada?: FacturaCompletaInterface;
  loadingDetalle = false;

  constructor(
    private facturasService: FacturasService
  ) { }

  ngOnInit(): void {
    this.listarFacturas();
  }

  listarFacturas() {
    this.loading = true;
    this.facturasService.getFacturas().subscribe({
      next: data => {
        this.facturas = data;
        this.calcularPaginacion();
        this.loading = false;
      },
      error: err => {
        console.error('Error al cargar facturas', err);
        this.loading = false;
      }
    });
  }

  calcularPaginacion() {
    this.paginasTotales = Math.ceil(this.facturas.length / this.itemsPorPagina);
    this.actualizarFacturasPorPagina();
  }

  actualizarFacturasPorPagina() {
    const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
    this.facturasPorPagina = this.facturas.slice(inicio, inicio + this.itemsPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.paginasTotales) {
      this.paginaActual = pagina;
      this.actualizarFacturasPorPagina();
    }
  }

  paginaAnterior() { this.cambiarPagina(this.paginaActual - 1); }
  paginaSiguiente() { this.cambiarPagina(this.paginaActual + 1); }

  get numPaginas(): number[] {
    return Array.from({ length: this.paginasTotales }, (_, i) => i + 1);
  }

  calcularFin(): number {
    return Math.min(this.paginaActual * this.itemsPorPagina, this.facturas.length);
  }

  verDetalle(idFactura: number) {
    this.mostrarModal = true;
    this.loadingDetalle = true;
    this.facturaSeleccionada = undefined;

    this.facturasService.getFacturaById(idFactura).subscribe({
      next: data => {
        this.facturaSeleccionada = data;
        this.loadingDetalle = false;
      },
      error: err => {
        console.error('Error al obtener factura', err);
        this.loadingDetalle = false;
      }
    });
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.facturaSeleccionada = undefined;
  }

}
