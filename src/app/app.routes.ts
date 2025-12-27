import { Routes } from '@angular/router';
import { Insumos } from './components/insumos/insumos';
import { Productos } from './components/productos/productos';
import { Stock } from './components/stock/stock';
import { Ganancias } from './components/ganancias/ganancias';
import { Facturas } from './components/facturas/facturas';

export const routes: Routes = [
    { path: '', redirectTo: '/insumos', pathMatch: 'full' },
    { path: 'insumos', component: Insumos },
    { path: 'productos', component: Productos },
    { path: 'stock', component: Stock },
    { path: 'ganancias', component: Ganancias },
    { path: 'facturas' , component: Facturas }
];
