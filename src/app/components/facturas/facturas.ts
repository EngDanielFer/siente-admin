import { Component } from '@angular/core';
import { ListaFacturas } from './lista-facturas/lista-facturas';

@Component({
  selector: 'app-facturas',
  imports: [ListaFacturas],
  templateUrl: './facturas.html',
  styleUrl: './facturas.css',
})
export class Facturas {

}
