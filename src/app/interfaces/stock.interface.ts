export interface StockInterface {
    id_producto: number,
    nombre_producto: string,
    cantidad_producto: number,
    fecha_insercion: string,
    id_producto_stock?: number
    stock_minimo?: number | null;
}

export interface StockBajoInterface {
    id: number;
    nombre_producto: string;
    stock_producto: number;
    stock_minimo: number;
}
 