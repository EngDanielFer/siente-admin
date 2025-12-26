import { TestBed } from '@angular/core/testing';

import { SharedStockService } from './shared-stock.service';

describe('SharedStockService', () => {
  let service: SharedStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
