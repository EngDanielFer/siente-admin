import { Injectable } from '@angular/core';
import { InsumosService } from '../insumos.service';
import { MatDialog } from '@angular/material/dialog';
import { AlertaInsumosDialog } from '../../components/shared/alerta-insumos-dialog/alerta-insumos-dialog';

@Injectable({
  providedIn: 'root',
})
export class AlertaInsumosService {

  constructor(
    private insumosService: InsumosService,
    private dialog: MatDialog
  ) { }

  verificarInsumosAlInicio(): void {
    this.insumosService.getInsumos().subscribe({
      next: (insumos) => {
        const insumosAgotados = insumos.filter(
          i => i.estado_insumo === 'Agregar más insumo'
        );

        if (insumosAgotados.length > 0) {
          this.dialog.open(AlertaInsumosDialog, {
            width: '520px',
            disableClose: false,
            data: { insumos: insumosAgotados }
          });
        }
      },
      error: (err) => {
        console.error('Error al verificar insumos al inicio');
      }
    });
  }
}
