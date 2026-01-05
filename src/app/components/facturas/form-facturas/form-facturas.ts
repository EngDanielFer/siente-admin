import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FacturasService } from '../../../services/facturas.service';
import { CommonModule } from '@angular/common';
import { ProductosInterface } from '../../../interfaces/productos.interface';
import { ProductosService } from '../../../services/productos.service';

@Component({
  selector: 'app-form-facturas',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-facturas.html',
  styleUrl: './form-facturas.css',
})
export class FormFacturas implements OnInit {

  facturaForm!: FormGroup;
  resultado: any | null = null;
  productosDisponibles: ProductosInterface[] = [];

  readonly ENVIO_MAYORISTA = 12000;

  constructor(
    private fb: FormBuilder,
    private facturasService: FacturasService,
    private productosService: ProductosService
  ) {
    this.facturaForm = this.fb.group({
      datosCliente: this.fb.group({
        nombre_cliente: ['', Validators.required],
        apellido_cliente: ['', Validators.required],
        email_cliente: ['', [Validators.required, Validators.email]],
        direccion_cliente: ['', Validators.required],
        complemento_direccion: [''],
        telefono_cliente: ['', Validators.required],
        pais_cliente: ['', Validators.required],
        region_cliente: ['', Validators.required],
        ciudad_cliente: ['', Validators.required],
      }),
      productos: this.fb.array([]),
      subtotal: [{ value: 0, disabled: true }],
      precio_envio: [0, [Validators.required, Validators.min(0)]],
      metodo_pago: ['', Validators.required],
      tipo_precio: ['mayor']
    });

    this.agregarProducto();
    this.cargarProductos();

    this.facturaForm.patchValue({
      precio_envio: this.ENVIO_MAYORISTA
    })
  }

  ngOnInit(): void {
    this.facturaForm.get('productos')!
      .valueChanges
      .subscribe(() => {
        this.calcularSubtotal();
      });

    this.facturaForm.get('tipo_precio')!
      .valueChanges
      .subscribe(() => {
        this.calcularSubtotal();
      });
  }

  get productos(): FormArray {
    return this.facturaForm.get('productos') as FormArray;
  }

  cargarProductos(): void {
    this.productosService.getProductos()
      .subscribe(productos => {
        this.productosDisponibles = productos.filter(p =>
          (p.stock_producto ?? 0) > 0
        );
      });
  }

  agregarProducto(): void {
    this.productos.push(
      this.fb.group({
        id_producto: ['', Validators.required],
        cantidad_producto: [1, [Validators.required, Validators.min(1)]]
      })
    );
  }

  eliminarProducto(index: number): void {
    this.productos.removeAt(index);
  }

  calcularSubtotal(): void {
    let subtotal = 0;
    const tipoPrecio = this.facturaForm.get('tipo_precio')?.value;

    this.productos.controls.forEach(control => {
      const idProducto = control.get('id_producto')?.value;
      const cantidad = control.get('cantidad_producto')?.value;

      if (!idProducto || !cantidad) return;

      const producto = this.productosDisponibles
        .find(p => p.id === Number(idProducto));

      if (!producto) return;

      const precioUnitario =
        tipoPrecio === 'detal'
          ? producto.precio_detal
          : producto.precio_por_mayor;

      subtotal += precioUnitario * cantidad;
    });

    this.facturaForm.get('subtotal')?.setValue(subtotal, { emitEvent: false });
  }

  enviarFactura(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    this.facturasService.crearFactura(this.facturaForm.value)
      .subscribe({
        next: res => this.resultado = res,
        error: err => alert(err.error?.message || 'Error al crear factura')
      });
  }
}
