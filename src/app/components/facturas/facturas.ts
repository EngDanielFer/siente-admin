import { Component } from '@angular/core';
import { ListaFacturas } from './lista-facturas/lista-facturas';
import { FormFacturas } from './form-facturas/form-facturas';

@Component({
  selector: 'app-facturas',
  imports: [ListaFacturas, FormFacturas],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css',
})
export class Facturas {

}
