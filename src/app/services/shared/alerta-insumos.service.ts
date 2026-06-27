import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { InsumosService } from '../insumos.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertaInsumosDialog } from '../../components/shared/alerta-insumos-dialog/alerta-insumos-dialog';
import { StockService } from '../stock.service';

@Injectable({
  providedIn: 'root',
})
export class AlertaInsumosService {

  constructor(
    private insumosService: InsumosService,
    private stockService: StockService,
    private dialog: MatDialog
  ) { }

  verificarInsumosAlInicio(): void {
    forkJoin({
      insumos: this.insumosService.getLowStock(),
      stock: this.stockService.getLowStock()
    }).subscribe({
      next: ({ insumos, stock }) => {
        if (insumos.length > 0 || stock.length > 0) {
          this.dialog.open(AlertaInsumosDialog, {
            width: '580px',
            disableClose: false,
            data: { insumos, stock }
          });
        }
      },
      error: (err) => {
        console.error('Error al verificar alertas al inicio', err);
      }
    });
  }
}
