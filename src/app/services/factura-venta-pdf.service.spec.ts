import { TestBed } from '@angular/core/testing';

import { FacturaVentaPdfService } from './factura-venta-pdf.service';

describe('FacturaVentaPdfService', () => {
  let service: FacturaVentaPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturaVentaPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
