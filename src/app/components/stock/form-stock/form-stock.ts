import { Component, OnInit } from '@angular/core';
import { ProductosInterface } from '../../../interfaces/productos.interface';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StockService } from '../../../services/stock.service';
import { Subscription } from 'rxjs';
import { SharedStockService } from '../../../services/shared/shared-stock.service';

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
    private sharedStockService: SharedStockService
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
    this.httpClient.get<ProductosInterface[]>('http://localhost:8000/api/siente/productos')
      .subscribe({
        next: (response) => {
          this.listaProductos = response;
          this.loadingProductos = false;
          console.log('Productos cargados:', this.listaProductos);
        },
        error: (error) => {
          console.error('Error al cargar los productos:', error);
          this.loadingProductos = false;
          alert("Ha ocurrido un error al cargar los productos");
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
      next: (response) => {
        console.log("Se ha agregado el siguiente stock: ", response);
        alert("Stock agregado correctamente");
        this.stockFormulario.reset({ id_producto: 0, cantidad_producto: '' });
        this.sharedStockService.notificarCambios();
        this.enviando = false;
        this.loading = false;
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
