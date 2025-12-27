import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-sidebar',
  imports: [NgIf, NgFor, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {

  isCollapsed = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.collapsed$.subscribe(collapsed => {
      this.isCollapsed = collapsed;
    });
  }

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  menuItems = [
    { icon: 'bi-puzzle', label: 'Insumos', route: '/insumos' },
    { icon: 'bi-leaf', label: 'Productos', route: '/productos' },
    { icon: 'bi-box-fill', label: 'Stock', route: '/stock' },
    { icon: 'bi-currency-dollar', label: 'Ganancias', route: '/ganancias' },
    { icon: 'bi-receipt', label: 'Facturas', route: '/facturas' }
  ]

}
