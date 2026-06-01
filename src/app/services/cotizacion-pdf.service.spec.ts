import { TestBed } from '@angular/core/testing';

import { CotizacionPdfService } from './cotizacion-pdf.service';

describe('CotizacionPdfService', () => {
  let service: CotizacionPdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CotizacionPdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
