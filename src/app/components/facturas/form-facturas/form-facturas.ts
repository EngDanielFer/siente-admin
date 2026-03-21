import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FacturasService } from '../../../services/facturas.service';
import { SharedFacturaService } from '../../../services/shared/shared-factura.service';
import { CommonModule } from '@angular/common';
import { ProductosInterface } from '../../../interfaces/productos.interface';
import { ProductosService } from '../../../services/productos.service';
import { Subscription } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-form-facturas',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-facturas.html',
  styleUrl: './form-facturas.css',
})
export class FormFacturas implements OnInit, OnDestroy {

  facturaForm!: FormGroup;
  resultado: any | null = null;
  productosDisponibles: ProductosInterface[] = [];

  mostrarFormulario = false;
  loading = false;

  private subscription: Subscription = new Subscription();

  readonly ENVIO_MAYORISTA = 12000;

  readonly COLOMBIA_DATA: Record<string, string[]> = {
    'Amazonas': ['Leticia', 'Puerto Nariño'],
    'Antioquia': ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro', 'Caucasia'],
    'Arauca': ['Arauca', 'Saravena', 'Tame'],
    'Atlántico': ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga'],
    'Bolívar': ['Cartagena', 'Magangué', 'El Carmen de Bolívar'],
    'Boyacá': ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá'],
    'Caldas': ['Manizales', 'Villamaría', 'La Dorada', 'Chinchiná'],
    'Caquetá': ['Florencia', 'San Vicente del Caguán'],
    'Casanare': ['Yopal', 'Aguazul', 'Villanueva'],
    'Cauca': ['Popayán', 'Santander de Quilichao', 'Puerto Tejada'],
    'Cesar': ['Valledupar', 'Aguachica', 'Codazzi'],
    'Chocó': ['Quibdó', 'Istmina', 'Tumaco'],
    'Córdoba': ['Montería', 'Lorica', 'Cereté', 'Sahagún'],
    'Cundinamarca': ['Bogotá D.C.', 'Soacha', 'Fusagasugá', 'Facatativá', 'Zipaquirá', 'Chía', 'Mosquera'],
    'Guainía': ['Inírida'],
    'Guaviare': ['San José del Guaviare'],
    'Huila': ['Neiva', 'Pitalito', 'Garzón'],
    'La Guajira': ['Riohacha', 'Maicao', 'Uribia'],
    'Magdalena': ['Santa Marta', 'Ciénaga', 'Fundación'],
    'Meta': ['Villavicencio', 'Acacías', 'Granada'],
    'Nariño': ['Pasto', 'Tumaco', 'Ipiales', 'Túquerres'],
    'Norte de Santander': ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario'],
    'Putumayo': ['Mocoa', 'Puerto Asís', 'Orito'],
    'Quindío': ['Armenia', 'Calarcá', 'Montenegro', 'Quimbaya'],
    'Risaralda': ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal'],
    'San Andrés y Providencia': ['San Andrés', 'Providencia'],
    'Santander': ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja'],
    'Sucre': ['Sincelejo', 'Corozal', 'Sampués'],
    'Tolima': ['Ibagué', 'Espinal', 'Melgar', 'Honda'],
    'Valle del Cauca': ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Buga', 'Cartago'],
    'Vaupés': ['Mitú'],
    'Vichada': ['Puerto Carreño'],
  };

  get departamentos(): string[] {
    return Object.keys(this.COLOMBIA_DATA).sort();
  }

  ciudadesFiltradas: string[] = [];

  constructor(
    private fb: FormBuilder,
    private facturasService: FacturasService,
    private productosService: ProductosService,
    private sharedFacturasService: SharedFacturaService,
    private snackBar: MatSnackBar
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
      precio_envio: [this.ENVIO_MAYORISTA, [Validators.required, Validators.min(0)]],
      metodo_pago: ['', Validators.required],
      tipo_precio: ['mayor']
    });

    this.cargarProductos();
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

    this.subscription.add(
      this.sharedFacturasService.mostrarFormFactura$.subscribe(mostrar => {
        this.mostrarFormulario = mostrar;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
    const tipoPrecio = this.facturaForm.get('tipo_precio')?.value;
    let subtotal = 0;

    this.productos.controls.forEach(control => {
      const idProducto = control.get('id_producto')?.value;
      const cantidad = control.get('cantidad_producto')?.value;

      if (!idProducto || !cantidad) return;

      const producto = this.productosDisponibles
        .find(p => p.id === Number(idProducto));

      if (!producto) return;

      const precio =
        tipoPrecio === 'detal'
          ? producto.precio_detal
          : producto.precio_por_mayor;

      subtotal += precio * cantidad;
    });

    this.facturaForm.get('subtotal')?.setValue(subtotal, { emitEvent: false });
  }

  enviarFactura(): void {
    if (this.facturaForm.invalid) {
      this.facturaForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.facturasService.crearFactura(this.facturaForm.value)
      .subscribe({
        next: res => {
          this.resultado = res;
          this.loading = false;
          this.snackBar.open('Se ha creado correctamente la factura', 'Cerrar', {
            duration: 3000,
            panelClass: ['snack-success']
          });
        },
        error: err => {
          this.loading = false;
          const msg = err.error?.message || 'Error al crear factura';
          this.snackBar.open(msg, 'Cerrar', {
            duration: 5000,
            panelClass: ['snack-error']
          });
        }
      });
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.sharedFacturasService.setMostrarFormFactura(this.mostrarFormulario);

    if (!this.mostrarFormulario) {
      this.facturaForm.reset();
      this.productos.clear();
      this.facturaForm.patchValue({
        precio_envio: this.ENVIO_MAYORISTA,
        tipo_precio: 'mayor'
      });
      this.resultado = null;
    }
  }

  onDepartamentoChange(): void {
    const depto = this.facturaForm.get('datosCliente.region_cliente')?.value;
    this.ciudadesFiltradas = this.COLOMBIA_DATA[depto] ?? [];
    this.facturaForm.get('datosCliente.ciudad_cliente')?.setValue('');
  }
}
