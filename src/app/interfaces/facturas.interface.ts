export interface FacturasInterface {
    id: number;
    fecha: string;
    nombreCliente: string;
    apellidoCliente: string;
    emailCliente: string;
    valorPagado: number;
    precioEnvio: number;
    valorTotal: number;
    metodoPago: string;
}
