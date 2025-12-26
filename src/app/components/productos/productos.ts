import { Component } from '@angular/core';
import { ListaProductos } from './lista-productos/lista-productos';
import { FormProductos } from './form-productos/form-productos';

@Component({
  selector: 'app-productos',
  imports: [FormProductos, ListaProductos],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {

}
