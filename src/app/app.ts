import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./ui/sidebar/sidebar";
import { SidebarService } from './services/sidebar.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('siente-admin');
  sidebarCollapsed = false;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.collapsed$.subscribe(collapsed => {
      this.sidebarCollapsed = collapsed;
    });
  }
}
