export interface CrearProductoDtoInterface {
    id: number;
    nombre_producto: string;
    descripcion_producto: string;
    peso_producto: number;
    imagen_producto: string | null;
    insumos: { id_insumo: number; cantidad: number }[];
    costo_luz: number;
    costo_agua: number;
    costo_gas: number;
    costo_aseo: number;
    costo_internet: number;
    costo_mano_obra: number;
    comentario_mano_obra: string;
    costo_transporte: number;
    costo_perdidas: number;
    costo_herramientas: number;
    costo_mark_redes: number;
    costo_mark_disenador: number;
    costo_admin: number;
    costo_etiqueta: number;
}
