import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { InsumosInterface } from '../../../interfaces/insumos.interface';
import { InsumosService } from '../../../services/insumos.service';
import { SharedInsumoService } from '../../../services/shared/shared-insumo.service';
import { SharedProductoService } from '../../../services/shared/shared-producto.service';

@Component({
  selector: 'app-alerta-insumos-bajos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alerta-insumos-bajos.html',
  styleUrl: './alerta-insumos-bajos.css',
})
export class AlertaInsumosBajos implements OnInit, OnDestroy {

  insumosConAlerta: InsumosInterface[] = [];

  private subscription = new Subscription();

  constructor(
    private insumosService: InsumosService,
    private sharedInsumoService: SharedInsumoService,
    private sharedProductoService: SharedProductoService
  ) { }

  ngOnInit(): void {
      this.cargarInsumosBajos();

      this.subscription.add(
        this.sharedInsumoService.cambios$.subscribe(() => this.cargarInsumosBajos())
      );
      this.subscription.add(
        this.sharedProductoService.cambio$.subscribe(() => this.cargarInsumosBajos())
      );
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe();
  }

  cargarInsumosBajos(): void {
    this.insumosService.getLowStock().subscribe({
      next: (data) => {
        this.insumosConAlerta = data ?? [];
      },
      error: (err) => {
        console.error('Error al cargar alertas de insumos', err);
      }
    });
  }
}
