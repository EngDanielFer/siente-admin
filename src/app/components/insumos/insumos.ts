import { Component } from '@angular/core';
import { FormInsumos } from "./form-insumos/form-insumos";
import { ListaInsumos } from "./lista-insumos/lista-insumos";

@Component({
  selector: 'app-insumos',
  imports: [FormInsumos, ListaInsumos],
  templateUrl: './insumos.html',
  styleUrl: './insumos.css',
})
export class Insumos {

}
