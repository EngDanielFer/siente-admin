import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { InsumosInterface } from '../../../interfaces/insumos.interface';

export interface InsumosFaltantesDialogData {
  mensajeError: string,
  insumos: InsumosInterface[]
}

@Component({
  selector: 'app-insumos-faltantes-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './insumos-faltantes-dialog.html',
  styleUrl: './insumos-faltantes-dialog.css',
})
export class InsumosFaltantesDialog {

  constructor(
    public dialogRef: MatDialogRef<InsumosFaltantesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: InsumosFaltantesDialogData
  ) { }

  cerrar(): void {
    this.dialogRef.close();
  }
}
