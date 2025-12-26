import { TestBed } from '@angular/core/testing';

import { GananciasService } from './ganancias.service';

describe('GananciasService', () => {
  let service: GananciasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GananciasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
