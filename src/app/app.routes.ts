import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('./app-shell').then(m => m.AppShell),
        children: [
            { path: '', redirectTo: '/insumos', pathMatch: 'full' },
            {
                path: 'insumos',
                loadComponent: () =>
                    import('./components/insumos/insumos').then(m => m.Insumos)
            },
            {
                path: 'productos',
                loadComponent: () =>
                    import('./components/productos/productos').then(m => m.Productos)
            },
            {
                path: 'stock',
                loadComponent: () =>
                    import('./components/stock/stock').then(m => m.Stock)
            },
            {
                path: 'ganancias',
                loadComponent: () =>
                    import('./components/ganancias/ganancias').then(m => m.Ganancias)
            },
            {
                path: 'facturas',
                loadComponent: () =>
                    import('./components/facturas/facturas').then(m => m.Facturas)
            }
        ]
    },
    { path: '**', redirectTo: 'login' }
];
