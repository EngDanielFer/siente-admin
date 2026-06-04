import { Injectable } from '@angular/core';

export interface ProductoCotizacion {
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
}

export interface DatosCotizacion {
  productos: ProductoCotizacion[];
  subtotalProductos: number;
  precioEnvio: number;
  totalFactura: number;
  tipoPrecio: 'mayor' | 'detal';
}

@Injectable({
  providedIn: 'root',
})
export class CotizacionPdfService {
  async descargarCotizacion(datos: DatosCotizacion): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const margIzq = 20;
    const margDer = 190;
    const anchoUtil = margDer - margIzq;
    let y = 20;

    const colores = {
      verdeOscuro: [21, 128, 61] as [number, number, number],
      verdeSuave: [220, 252, 231] as [number, number, number],
      grisClaro: [245, 245, 245] as [number, number, number],
      grisBorde: [200, 200, 200] as [number, number, number],
      negro: [30, 30, 30] as [number, number, number],
      blanco: [255, 255, 255] as [number, number, number],
      amarilloClaro: [245, 245, 132] as [number, number, number],
    };

    const logoBase64 = await this.cargarImagenComoBase64('../../assets/logo_siente.png');

    const alturaEncabezado = 42;
    doc.setFillColor(...colores.amarilloClaro);
    doc.rect(0, 0, 210, alturaEncabezado, 'F');

    if (logoBase64) {
      const logoAltoMm = 35;
      const logoAnchoMm = logoAltoMm * (300/327);
      doc.addImage(logoBase64, 'PNG', margDer - logoAnchoMm, 3, logoAnchoMm, logoAltoMm);
    }

    doc.setTextColor(...colores.negro);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Cotización de productos Siente', margIzq, 18);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const fecha = new Date().toLocaleDateString('es-CO', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
    doc.text(`Fecha: ${fecha}`, margIzq, 27);
    doc.text(
      `Tipo de precio: ${datos.tipoPrecio === 'mayor' ? 'Precio al por mayor' : 'Precio detal'}`,
      margIzq, 34
    );

    y = alturaEncabezado + 10;

    doc.setTextColor(...colores.negro);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle de productos', margIzq, y);
    y += 6;

    const colProducto = margIzq;
    const colPrecio = margIzq + anchoUtil * 0.50;
    const colCantidad = margIzq + anchoUtil * 0.67;
    const colSubtotal = margIzq + anchoUtil * 0.82;
    const alturaFila = 8;

    doc.setFillColor(...colores.verdeOscuro);
    doc.rect(margIzq, y, anchoUtil, alturaFila, 'F');

    doc.setTextColor(...colores.blanco);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Producto', colProducto + 2, y + 5.5);
    doc.text('Precio unitario', colPrecio, y + 5.5);
    doc.text('Cantidad', colCantidad, y + 5.5);
    doc.text('Subtotal', colSubtotal, y + 5.5);
    y += alturaFila;

    doc.setTextColor(...colores.negro);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);

    datos.productos.forEach((p, i) => {
      const esPar = i % 2 === 0;
      doc.setFillColor(...(esPar ? colores.blanco : colores.grisClaro));
      doc.rect(margIzq, y, anchoUtil, alturaFila, 'F');

      doc.setDrawColor(...colores.grisBorde);
      doc.line(margIzq, y + alturaFila, margDer, y + alturaFila);

      doc.text(p.nombre, colProducto + 2, y + 5.5);
      doc.text(this.formatCOP(p.precioUnitario), colPrecio, y + 5.5);
      doc.text(String(p.cantidad), colCantidad, y + 5.5);
      doc.text(this.formatCOP(p.subtotal), colSubtotal, y + 5.5);
      y += alturaFila;
    });

    y += 6;

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
        { label: 'Subtotal productos:', valor: datos.subtotalProductos },
        { label: 'Precio envío:', valor: datos.precioEnvio },
        { label: 'Total:', valor: datos.totalFactura, negrita: true, fondo: colores.verdeOscuro, colorTexto: colores.blanco }
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

    y += 10;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      'Esta cotización es informativa y no representa una venta real',
      margIzq, y
    );

    doc.save(`cotizacion_${Date.now()}.pdf`);
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
