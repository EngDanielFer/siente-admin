import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { CostoFijoInterface } from '../../../../interfaces/costo-fijo.interface';
import { ProductosService } from '../../../../services/productos.service';

@Component({
  selector: 'app-costos-fijos-productos',
  imports: [CommonModule],
  templateUrl: './costos-fijos-productos.html',
  styleUrl: './costos-fijos-productos.css',
  encapsulation: ViewEncapsulation.None,
})
export class CostosFijosProductos implements OnInit {
  @Input() productoId!: number;
  @Output() cerrar = new EventEmitter<void>();
  
  costosFijos: CostoFijoInterface[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {
    this.cargarCostosFijos();
  }

  cargarCostosFijos(): void {
    this.loading = true;
    this.error = '';

    this.productosService.getCostosFijos(this.productoId).subscribe({
      next: (data) => {
        this.costosFijos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar costos fijos:', error);
        this.error = 'Ha ocurrido un error al cargar los costos fijos del producto';
        this.loading = false;
      }
    });
    
  }

  calcularTotal(): number {
    return this.costosFijos.reduce((total, costo) => total + costo.costo, 0);
  }

}
