import { TestBed } from '@angular/core/testing';

import { SharedFacturaService } from './shared-factura.service';

describe('SharedFacturaService', () => {
  let service: SharedFacturaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedFacturaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
