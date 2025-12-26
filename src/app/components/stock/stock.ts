import { Component } from '@angular/core';
import { FormStock } from './form-stock/form-stock';
import { ListaStock } from './lista-stock/lista-stock';

@Component({
  selector: 'app-stock',
  imports: [FormStock, ListaStock],
  templateUrl: './stock.html',
  styleUrl: './stock.css',
})
export class Stock {

}
