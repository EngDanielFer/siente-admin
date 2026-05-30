import { TestBed } from '@angular/core/testing';

import { AlertaInsumosService } from './alerta-insumos.service';

describe('AlertaInsumosService', () => {
  let service: AlertaInsumosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertaInsumosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
