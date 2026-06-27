import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { StockBajoInterface } from '../../../interfaces/stock.interface';

export interface AlertaInsumosDialogData {
  insumos: InsumosInterface[];
  stock: StockBajoInterface[];
}

@Component({
  selector: 'app-alerta-insumos-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './alerta-insumos-dialog.html',
  styleUrl: './alerta-insumos-dialog.css',
})
export class AlertaInsumosDialog {

  constructor(
    public dialogRef: MatDialogRef<AlertaInsumosDialog>,
    @Inject(MAT_DIALOG_DATA) public data: AlertaInsumosDialogData
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
