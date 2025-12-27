import { FacturaDetalleInterface } from "./factura-detalle.interface";

export interface FacturaCompletaInterface {

    id: number;
    fecha: string;

    nombreCliente: string;
    apellidoCliente: string;
    emailCliente: string;
    direccionCliente: string;
    complementoDireccion: string;
    telefonoCliente: string;
    paisCliente: string;
    regionCliente: string;
    ciudadCliente: string;

    valorPagado: number;
    precioEnvio: number;
    valorTotal: number;
    metodoPago: string;

    detalle: FacturaDetalleInterface[];
}
