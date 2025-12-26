import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ProductosService } from '../../../../services/productos.service';
import { InsumosProductoInterface } from '../../../../interfaces/insumos-producto.interface';

@Component({
  selector: 'app-insumos-productos',
  imports: [CommonModule],
  templateUrl: './insumos-productos.html',
  styleUrl: './insumos-productos.css',
  encapsulation: ViewEncapsulation.None,
})
export class InsumosProductos implements OnInit {
  @Input() productoId!: number;
  @Output() cerrar = new EventEmitter<void>();

  insumos: InsumosProductoInterface[] = [];
  loading: boolean = false;
  error: string = '';

  constructor(private productosService: ProductosService) { }

  ngOnInit(): void {
    this.cargarInsumos();
  }

  cargarInsumos(): void {
    this.loading = true;
    this.error = '';

    this.productosService.getInsumos(this.productoId).subscribe({
      next: (data) => {
        this.insumos = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Ha ocurrido un error al cargar los inusmos:', error);
        this.error = 'Error al cargar los insumos';
        this.loading = false;
      }
    });
  }

}
