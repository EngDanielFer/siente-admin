import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SidebarService } from '../../services/sidebar.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  private sidebarService = inject(SidebarService);
  protected authService = inject(AuthService);

  isCollapsed = false;

  menuItems = [
    { icon: 'bi-puzzle', label: 'Insumos', route: '/insumos' },
    { icon: 'bi-leaf', label: 'Productos', route: '/productos' },
    { icon: 'bi-box-fill', label: 'Stock', route: '/stock' },
    { icon: 'bi-currency-dollar', label: 'Ganancias', route: '/ganancias' },
    { icon: 'bi-receipt', label: 'Facturas', route: '/facturas' }
  ]

  constructor() {
    this.sidebarService.collapsed$.subscribe(c => {
      this.isCollapsed = c;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  logout() {
    this.authService.logout();
  }

}
