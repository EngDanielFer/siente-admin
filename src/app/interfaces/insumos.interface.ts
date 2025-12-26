export interface InsumosInterface {
    nombre_insumo: string;
    cantidad_insumo_total: number;
    cantidad_insumo_restante?: number;
    proveedor_insumo: string;
    precio_insumo: number;
    precio_por_g_ml?: number;
    estado_insumo?: string;
    id?: number;
}
