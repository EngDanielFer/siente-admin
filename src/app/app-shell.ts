import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarService } from './services/sidebar.service';
import { Sidebar } from './ui/sidebar/sidebar';
import { AlertaInsumosService } from './services/shared/alerta-insumos.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, Sidebar],
  template: `
    <app-sidebar></app-sidebar>
    <main class="content" [class.collapsed]="isCollapsed">
      <div class="container-fluid p-4">
        <router-outlet></router-outlet>
      </div>
    </main>
  `,
  styles: [`
    .content {
      margin-left: 250px;
      transition: margin-left 0.3s ease;
      min-height: 100vh;
    }
    .content.collapsed {
      margin-left: 72px;
    }
  `]
})
export class AppShell {
  sidebarService = inject(SidebarService);
  isCollapsed = false;

  constructor(
    private alertaInsumosService: AlertaInsumosService
  ) {
    this.sidebarService.collapsed$.subscribe(c => (this.isCollapsed = c));
  }

  ngOnInit(): void {
    this.alertaInsumosService.verificarInsumosAlInicio();
  }
}