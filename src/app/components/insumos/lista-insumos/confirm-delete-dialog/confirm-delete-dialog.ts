import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';

export interface ConfirmDeleteData {
  nombre: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  template: `
    <h2 class="text-center" mat-dialog-title>Confirmar elminiación</h2>
    <mat-dialog-content>
      <p>¿Estás seguro de eliminar <strong>{{ data.nombre }}</strong>?</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button class="btn btn-sm btn-outline-secondary me-2" [mat-dialog-close]="false">Cancelar</button>
      <button class="btn btn-sm btn-danger" [mat-dialog-close]="true">Eliminar</button>
    </mat-dialog-actions>
    `,
  styles: [`
    mat-dialog-actions {
      gap: 8px;
    }
    `],
})
export class ConfirmDeleteDialog {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteData
  ) { }
}
