import { TestBed } from '@angular/core/testing';

import { SharedProductoService } from './shared-producto.service';

describe('SharedProductoService', () => {
  let service: SharedProductoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedProductoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
