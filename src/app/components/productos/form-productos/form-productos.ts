import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { Subscription } from 'rxjs';
import { SharedProductoService } from '../../../services/shared/shared-producto.service';
import { ProductosService } from '../../../services/productos.service';
import { InsumosService } from '../../../services/insumos.service';
import { ProductoCompletoInterface } from '../../../interfaces/producto-completo.interface';

@Component({
  selector: 'app-form-productos',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './form-productos.html',
  styleUrl: './form-productos.css',
})
export class FormProductos implements OnInit, OnDestroy {

  productoFormulario!: FormGroup;
  previewImagen: string | ArrayBuffer | null = null;
  archivoImagen: File | null = null;
  submitted = false;
  loading = false;
  modoEdicion = false;
  productoId: number | null = null;

  listaInsumos: InsumosInterface[] = [];
  loadingInsumos = false;

  mostrarFormulario: boolean = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private sharedProductoService: SharedProductoService,
    private productosService: ProductosService,
    private insumosService: InsumosService
  ) { }

  ngOnInit(): void {
    this.initFormulario();
    this.cargarInsumos();

    this.subscription.add(
      this.sharedProductoService.productoSeleccionado$.subscribe(producto => {
        if (producto) {
          this.cargarProductoParaEditar(producto);
        }
      })
    );

    this.subscription.add(
      this.sharedProductoService.mostrarFormulario$.subscribe(mostrar => {
        this.mostrarFormulario = mostrar;
      })
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  initFormulario(): void {
    this.productoFormulario = this.formBuilder.group({
      id: [null, [Validators.required, Validators.min(1)]],
      nombre_producto: ['', Validators.required],
      descripcion_producto: ['', Validators.required],
      peso_producto: [0, [Validators.required, Validators.min(1)]],
      imagen_producto: [null],
      insumos: this.formBuilder.array([]),
      costo_luz: [0, [Validators.required, Validators.min(0)]],
      costo_agua: [0, [Validators.required, Validators.min(0)]],
      costo_gas: [0, [Validators.required, Validators.min(0)]],
      costo_aseo: [0, [Validators.required, Validators.min(0)]],
      costo_internet: [0, [Validators.required, Validators.min(0)]],
      costo_mano_obra: [0, [Validators.required, Validators.min(0)]],
      comentario_mano_obra: [''],
      costo_transporte: [0, [Validators.required, Validators.min(0)]],
      costo_perdidas: [0, [Validators.required, Validators.min(0)]],
      costo_herramientas: [0, [Validators.required, Validators.min(0)]],
      costo_mark_redes: [0, [Validators.required, Validators.min(0)]],
      costo_mark_disenador: [0, [Validators.required, Validators.min(0)]],
      costo_admin: [0, [Validators.required, Validators.min(0)]],
      costo_etiqueta: [0, [Validators.required, Validators.min(0)]]
    });

    this.productoFormulario.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  cargarProductoParaEditar(producto: ProductoCompletoInterface): void {
    this.modoEdicion = true;
    this.productoId = producto.id;

    this.productoFormulario.patchValue({
      id: producto.id,
      nombre_producto: producto.nombre_producto,
      descripcion_producto: producto.descripcion_producto,
      peso_producto: producto.peso_producto,
      costo_luz: producto.costo_luz || 0,
      costo_agua: producto.costo_agua || 0,
      costo_gas: producto.costo_gas || 0,
      costo_aseo: producto.costo_aseo || 0,
      costo_internet: producto.costo_internet || 0,
      costo_mano_obra: producto.costo_mano_obra || 0,
      comentario_mano_obra: producto.comentario_mano_obra || '',
      costo_transporte: producto.costo_transporte || 0,
      costo_perdidas: producto.costo_perdidas || 0,
      costo_herramientas: producto.costo_herramientas || 0,
      costo_mark_redes: producto.costo_mark_redes || 0,
      costo_mark_disenador: producto.costo_mark_disenador || 0,
      costo_admin: producto.costo_admin || 0,
      costo_etiqueta: producto.costo_etiqueta || 0
    });

    this.productoFormulario.get('id')?.disable();

    if (producto.imagen_producto) {
      this.previewImagen = `data:image/jpeg;base64,${producto.imagen_producto}`;
    }

    this.insumos.clear();
    if (producto.insumos && producto.insumos.length > 0) {
      producto.insumos.forEach((insumo: any) => {
        const grupoInsumo = this.formBuilder.group({
          id_insumo: [insumo.id_insumo, [Validators.required, Validators.min(1)]],
          cantidad: [insumo.cantidad, [Validators.required, Validators.min(0.01)]]
        });
        this.insumos.push(grupoInsumo);
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cargarInsumos(): void {
    this.loadingInsumos = true;
    this.insumosService.getInsumos()
      .subscribe({
        next: (response) => {
          this.listaInsumos = response;
          this.loadingInsumos = false;
          console.log('Insumos cargados:', this.listaInsumos);
        },
        error: (error) => {
          console.error('Error al cargar insumos:', error);
          this.loadingInsumos = false;
          alert("Ha ocurrido un error al cargar los insumos");
        }
      });
  }

  get insumos(): FormArray {
    return this.productoFormulario.get('insumos') as FormArray;
  }

  agregarInsumo(): void {
    const grupoInsumo = this.formBuilder.group({
      id_insumo: [null, [Validators.required, Validators.min(1)]],
      cantidad: [null, [Validators.required, Validators.min(0.01)]]
    });

    grupoInsumo.valueChanges.subscribe(() => {
      this.cdr.detectChanges();
    });

    this.insumos.push(grupoInsumo);
  }

  eliminarInsumo(index: number): void {
    this.insumos.removeAt(index);
  }

  getNombreInsumo(id: number): string {
    const insumo = this.listaInsumos.find(i => i.id === id);
    return insumo ? insumo.nombre_insumo : 'Desconocido';
  }

  getPrecioInsumo(id: number): number {
    if (!id || id === 0) {
      return 0;
    }

    const idNum = Number(id);

    if (isNaN(idNum)) {
      console.log('ID no es un número válido:', id);
      return 0;
    }

    const insumo = this.listaInsumos.find(i => i.id === idNum);

    if (!insumo) {
      console.log('No se encontró el insumo con ID:', idNum);
      return 0;
    }

    const precio = (insumo as any).precio_por_g_ml;

    return precio;
  }

  getInsumosDisponibles(indexAct: number): InsumosInterface[] {
    const insumosSelecc = this.insumos.controls
      .map((control, index) => index !== indexAct ? control.get('id_insumo')?.value : null)
      .filter(id => id !== null && id !== 0);

    return this.listaInsumos.filter(insumo => !insumosSelecc.includes(insumo.id));
  }

  calcularCostoInsumo(idInsumo: number, cantidad: number): number {
    if (!idInsumo || !cantidad || idInsumo === 0 || cantidad <= 0) {
      return 0;
    }
    const precioUnitario = this.getPrecioInsumo(idInsumo);
    return precioUnitario * cantidad;
  }

  calcularCostoTotalInsumos(): number {
    let total = 0;
    this.insumos.controls.forEach(control => {
      const idInsumo = control.get('id_insumo')?.value;
      const cantidad = control.get('cantidad')?.value;
      if (idInsumo && cantidad) {
        total += this.calcularCostoInsumo(idInsumo, cantidad);
      }
    });
    return total;
  }

  calcularCostosFijos(): number {
    const form = this.productoFormulario.getRawValue();
    return (
      (form.costo_luz || 0) +
      (form.costo_agua || 0) +
      (form.costo_gas || 0) +
      (form.costo_aseo || 0) +
      (form.costo_internet || 0) +
      (form.costo_mano_obra || 0) +
      (form.costo_transporte || 0) +
      (form.costo_perdidas || 0) +
      (form.costo_herramientas || 0) +
      (form.costo_mark_redes || 0) +
      (form.costo_mark_disenador || 0) +
      (form.costo_admin || 0) +
      (form.costo_etiqueta || 0)
    );
  }

  calcularCostoTotal(): number {
    return this.calcularCostoTotalInsumos() + this.calcularCostosFijos();
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoImagen = file;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.previewImagen = e.target?.result || null;
      };
      reader.readAsDataURL(file);
    }
  }

  async convertirImagenABase64(): Promise<string | null> {
    if (!this.archivoImagen) {
      return null;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(this.archivoImagen!);
    });
  }

  async onSubmit(): Promise<void> {
    this.submitted = true;

    if (this.productoFormulario.invalid) {
      this.marcarCamposComoTocados();
      alert("Por favor complete todos los campos requeridos correctamente");
      return;
    }

    this.loading = true;

    try {
      const imgBase64 = await this.convertirImagenABase64();
      const formValue = this.productoFormulario.getRawValue();

      const prodData = {
        id: Number(formValue.id),
        nombre_producto: formValue.nombre_producto.trim(),
        descripcion_producto: formValue.descripcion_producto.trim(),
        peso_producto: Number(formValue.peso_producto),
        imagen_producto: imgBase64,
        insumos: formValue.insumos.map((insumo: any) => ({
          id_insumo: Number(insumo.id_insumo),
          cantidad: Number(insumo.cantidad)
        })),
        costo_luz: Number(formValue.costo_luz || 0),
        costo_agua: Number(formValue.costo_agua || 0),
        costo_gas: Number(formValue.costo_gas || 0),
        costo_aseo: Number(formValue.costo_aseo || 0),
        costo_internet: Number(formValue.costo_internet || 0),
        costo_mano_obra: Number(formValue.costo_mano_obra || 0),
        comentario_mano_obra: formValue.comentario_mano_obra ? formValue.comentario_mano_obra.trim() : '',
        costo_transporte: Number(formValue.costo_transporte || 0),
        costo_perdidas: Number(formValue.costo_perdidas || 0),
        costo_herramientas: Number(formValue.costo_herramientas || 0),
        costo_mark_redes: Number(formValue.costo_mark_redes || 0),
        costo_mark_disenador: Number(formValue.costo_mark_disenador || 0),
        costo_admin: Number(formValue.costo_admin || 0),
        costo_etiqueta: Number(formValue.costo_etiqueta || 0)
      };

      console.log('Datos a enviar:', prodData);

      if (this.modoEdicion) {
        this.productosService.updateProducto(prodData.id, prodData)
          .subscribe({
            next: (response) => {
              alert("Producto actualizado exitosamente");
              this.resetFormulario();
              this.sharedProductoService.notificarCambios();
              this.loading = false;
            },
            error: (error) => {
              this.manejarError(error, 'actualizar');
            }
          });
      } else {
        this.productosService.createProducto(prodData)
          .subscribe({
            next: (response) => {
              console.log('Respuesta del servidor:', response);
              alert("Se ha creado el producto exitosamente");
              this.resetFormulario();
              this.sharedProductoService.notificarCambios();
              this.loading = false;
            },
            error: (error) => {
              this.manejarError(error, 'crear');
              // console.error('Error:', error);
              // console.error('Status:', error.status);
              // console.error('Body:', error.error);

              // if (error.status === 201) {
              //   console.log('Producto creado (201)');
              //   alert("Se ha creado el producto exitosamente");
              //   this.resetFormulario();
              //   this.sharedProductoService.notificarCambios();
              //   this.loading = false;
              //   return;
              // }

              // let mensajeError = "Error al crear el producto\n\n";

              // if (error.status === 400) {
              //   mensajeError += "Bad Request - El servidor rechazó los datos.\n";
              //   if (typeof error.error === 'object') {
              //     mensajeError += "Detalles:\n" + JSON.stringify(error.error, null, 2);
              //   } else {
              //     mensajeError += error.error;
              //   }
              // } else if (error.status === 500) {
              //   mensajeError += "Error interno del servidor";
              // } else if (error.status === 0) {
              //   mensajeError += "No se pudo conectar con el servidor. Verifique que el backend esté corriendo.";
              // } else {
              //   mensajeError += error.message || "Error desconocido";
              // }

              // alert(mensajeError);
              // this.loading = false;
            },
            complete: () => {
              this.loading = false;
            }
          });
      }

    } catch (error) {
      console.error('Error al procesar la imagen:', error);
      alert("Error al procesar la imagen");
      this.loading = false;
    }
  }

  manejarError(error: any, accion: string): void {
    console.error("Error: ", error);

    if (error.status === 201 || error.status === 200) {
      alert(`Producto ${accion === 'crear' ? 'creado' : 'actualizado'} exitosamente`);
      this.resetFormulario();
      this.sharedProductoService.notificarCambios();
      this.loading = false;
      return;
    }

    let mensajeError = `Error al ${accion} el producto\n\n`;

    if (error.status === 400) {
      mensajeError += "Bad Request - El servidor rechazó los datos.";
    } else if (error.status === 409) {
      mensajeError += "El producto ya existe. Use el modo de edición.";
    } else if (error.status === 404) {
      mensajeError += "El producto no existe.";
    } else if (error.status === 500) {
      mensajeError += "Error interno del servidor";
    } else if (error.status === 0) {
      mensajeError += "No se pudo conectar con el servidor.";
    } else {
      mensajeError += error.message || "Error desconocido";
    }

    alert(mensajeError);
    this.loading = false;
  }

  // getFormValidationErrors(): any[] {
  //   const errors: any[] = [];
  //   Object.keys(this.productoFormulario.controls).forEach(key => {
  //     const controlErrors = this.productoFormulario.get(key)?.errors;
  //     if (controlErrors) {
  //       errors.push({ field: key, errors: controlErrors });
  //     }
  //   });

  //   this.insumos.controls.forEach((group, index) => {
  //     Object.keys((group as FormGroup).controls).forEach(key => {
  //       const controlErrors = (group as FormGroup).get(key)?.errors;
  //       if (controlErrors) {
  //         errors.push({ field: `insumo[${index}].${key}`, errors: controlErrors });
  //       }
  //     });
  //   });

  //   return errors;
  // }

  marcarCamposComoTocados(): void {
    Object.keys(this.productoFormulario.controls).forEach(key => {
      const control = this.productoFormulario.get(key);
      control?.markAsTouched();

      if (control instanceof FormArray) {
        control.controls.forEach(group => {
          Object.keys((group as FormGroup).controls).forEach(innerKey => {
            (group as FormGroup).get(innerKey)?.markAsTouched();
          });
        });
      }
    });
  }

  cancelarEdicion(): void {
    if (confirm("¿Desea cancelar la edición? Se perderán los campos no guardados")) {
      this.resetFormulario();
    }
  }

  resetFormulario(): void {
    this.modoEdicion = false;
    this.productoId = null;
    this.productoFormulario.reset({
      id: 0,
      nombre_producto: '',
      descripcion_producto: '',
      peso_producto: 0,
      costo_luz: 0,
      costo_agua: 0,
      costo_gas: 0,
      costo_aseo: 0,
      costo_internet: 0,
      costo_mano_obra: 0,
      comentario_mano_obra: '',
      costo_transporte: 0,
      costo_perdidas: 0,
      costo_herramientas: 0,
      costo_mark_redes: 0,
      costo_mark_disenador: 0,
      costo_admin: 0,
      costo_etiqueta: 0
    });
    this.productoFormulario.get('id')?.enable();
    this.insumos.clear();
    this.previewImagen = null;
    this.archivoImagen = null;
    this.submitted = false;
    this.sharedProductoService.limpiarSeleccion();
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
    this.sharedProductoService.setMostrarFormulario(this.mostrarFormulario);

    if (!this.mostrarFormulario) {
      this.resetFormulario();
    }

  }
}
