import { Injectable } from '@angular/core';
import { FacturaCompletaInterface } from '../interfaces/factura-completa.interface';

@Injectable({
  providedIn: 'root',
})
export class FacturaVentaPdfService {

  async descargarFactura(factura: FacturaCompletaInterface): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const margIzq = 20;
    const margDer = 190;
    const anchoUtil = margDer - margIzq;
    let y = 20;

    const colores = {
      verdeOscuro: [21, 128, 61] as [number, number, number],
      verdeSuave: [240, 253, 244] as [number, number, number],
      grisClaro: [245, 245, 245] as [number, number, number],
      grisBorde: [200, 200, 200] as [number, number, number],
      grisTexto: [80, 80, 80] as [number, number, number],
      negro: [30, 30, 30] as [number, number, number],
      blanco: [255, 255, 255] as [number, number, number],
      amarilloClaro: [245, 245, 132] as [number, number, number],
    };

    const logoBase64 = await this.cargarImagenComoBase64('../../assets/logo_siente.png');

    const alturaEncabezado = 42;
    doc.setFillColor(...colores.amarilloClaro);
    doc.rect(0, 0, 210, alturaEncabezado, 'F');

    if (logoBase64) {
      const logoAltoMm = 22;
      const logoAnchoMm = logoAltoMm * (300 / 327);
      doc.addImage(logoBase64, 'PNG', margDer - logoAnchoMm, 3, logoAnchoMm, logoAltoMm);
    }

    doc.setTextColor(...colores.negro);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Factura de Venta', margIzq, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`N° ${String(factura.id).padStart(6, '0')}`, margIzq, 26);
    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    doc.text(`Fecha: ${fecha}`, margIzq, 33);
    doc.text(
      `Método de pago: ${factura.metodoPago}`, margIzq, 38
    );

    y = alturaEncabezado + 10;

    doc.setFillColor(...colores.verdeSuave);
    doc.rect(margIzq, y, anchoUtil, 36, 'F');
    doc.setDrawColor(...colores.verdeOscuro);
    doc.rect(margIzq, y, anchoUtil, 36, 'S');

    doc.setTextColor(...colores.verdeOscuro);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Datos del cliente', margIzq + 3, y + 7);

    doc.setTextColor(...colores.negro);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    const col1 = margIzq + 3;
    const col2 = margIzq + anchoUtil / 2 + 5;

    doc.setFont('helvetica', 'bold');
    doc.text('Nombre:', col1, y + 14);
    doc.setFont('helvetica', 'normal');
    doc.text(`${factura.nombreCliente} ${factura.apellidoCliente}`, col1 + 20, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.text('Email:', col1, y + 21);
    doc.setFont('helvetica', 'normal');
    doc.text(factura.emailCliente, col1 + 20, y + 21);

    doc.setFont('helvetica', 'bold');
    doc.text('Teléfono:', col1, y + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(factura.telefonoCliente, col1 + 20, y + 28);

    doc.setFont('helvetica', 'bold');
    doc.text('Dirección:', col2, y + 14);
    const direccionCompleta = factura.complementoDireccion
      ? `${factura.direccionCliente}, ${factura.complementoDireccion}`
      : factura.direccionCliente;
    doc.setFont('helvetica', 'normal');
    doc.text(direccionCompleta, col2 + 22, y + 14, { maxWidth: 60 });

    doc.setFont('helvetica', 'bold');
    doc.text('Ciudad:', col2, y + 28);
    doc.setFont('helvetica', 'normal');
    doc.text(`${factura.ciudadCliente}, ${factura.regionCliente}`, col2 + 18, y + 28);

    y += 46;

    doc.setTextColor(...colores.verdeOscuro);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle de Compra', margIzq, y);
    y += 5;

    const colProducto = margIzq;
    const colPrecio = margIzq + anchoUtil * 0.52;
    const colCantidad = margIzq + anchoUtil * 0.68;
    const colSubtotal = margIzq + anchoUtil * 0.83;
    const alturaFila = 8;

    doc.setFillColor(...colores.verdeOscuro);
    doc.rect(margIzq, y, anchoUtil, alturaFila, 'F');
    doc.setTextColor(...colores.blanco);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', colProducto + 2, y + 5.5);
    doc.text('Precio Unitario', colPrecio, y + 5.5);
    doc.text('Cantidad', colCantidad, y + 5.5);
    doc.text('Subtotal', colSubtotal, y + 5.5);
    y += alturaFila;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    factura.detalle.forEach((item, i) => {
      const esPar = i % 2 === 0;
      doc.setFillColor(...(esPar ? colores.blanco : colores.grisClaro));
      doc.rect(margIzq, y, anchoUtil, alturaFila, 'F');
      doc.setDrawColor(...colores.grisBorde);
      doc.line(margIzq, y + alturaFila, margDer, y + alturaFila);

      doc.setTextColor(...colores.negro);
      doc.text(item.nombreProducto, colProducto + 2, y + 5.5);
      doc.text(this.formatCOP(Math.round(item.precioUnitario)), colPrecio, y + 5.5);
      doc.text(String(item.cantidadProducto), colCantidad, y + 5.5);
      doc.text(this.formatCOP(Math.round(item.subtotal)), colSubtotal, y + 5.5);
      y += alturaFila;
    });

    y += 8;

    const anchoTotales = 90;
    const xTotales = margDer - anchoTotales;
    const alturaTotales = 8;

    const filasTotales: {
      label: string;
      valor: number;
      negrita?: boolean;
      fondo?: [number, number, number];
      colorTexto?: [number, number, number];
    }[] = [
        { label: 'Subtotal productos:', valor: Math.round(factura.valorPagado) },
        { label: 'Precio envío:', valor: Math.round(factura.precioEnvio) },
        {
          label: 'Total a pagar:',
          valor: Math.round(factura.valorTotal),
          negrita: true,
          fondo: colores.verdeOscuro,
          colorTexto: colores.blanco
        },
      ];

    filasTotales.forEach(fila => {
      if (fila.fondo) {
        doc.setFillColor(...fila.fondo);
        doc.rect(xTotales, y, anchoTotales, alturaTotales, 'F');
      }
      doc.setFont('helvetica', fila.negrita ? 'bold' : 'normal');
      doc.setFontSize(fila.negrita ? 10 : 9);
      doc.setTextColor(...(fila.colorTexto ?? colores.negro));
      doc.text(fila.label, xTotales + 3, y + 5.5);
      doc.text(this.formatCOP(fila.valor), margDer - 3, y + 5.5, { align: 'right' });
      y += alturaTotales;
    });

    y += 14;

    doc.setDrawColor(...colores.verdeOscuro);
    doc.line(margIzq, y, margDer, y);
    y += 5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(...colores.grisTexto);
    doc.text('Gracias por tu compra', margIzq, y);

    doc.save(`factura_${String(factura.id).padStart(6, '0')}_${Date.now()}.pdf`);
  }

  private cargarImagenComoBase64(ruta: string): Promise<string | null> {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image.png'));
      };
      img.onerror = () => {
        console.warn('No se pudo cargar el logo:', ruta);
        resolve(null);
      };
      img.src = ruta;
    });
  }

  private formatCOP(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(valor);
  }
}
