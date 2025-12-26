export interface ProductosInterface {
    nombre_producto: string,
    descripcion_producto: string,
    peso_producto: number,
    costo_produccion: number,
    ganancia_por_mayor: number,
    ganancia_detal: number,
    precio_por_mayor: number,
    precio_detal: number,
    id?: number,
    imagen_producto?: string
}
