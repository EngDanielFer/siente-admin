import { TestBed } from '@angular/core/testing';

import { SharedInsumoService } from './shared-insumo.service';

describe('SharedInsumoService', () => {
  let service: SharedInsumoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedInsumoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
