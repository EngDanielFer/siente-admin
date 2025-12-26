import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosFijosProductos } from './costos-fijos-productos';

describe('CostosFijosProductos', () => {
  let component: CostosFijosProductos;
  let fixture: ComponentFixture<CostosFijosProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CostosFijosProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CostosFijosProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
