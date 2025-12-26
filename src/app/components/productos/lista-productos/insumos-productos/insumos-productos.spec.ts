import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosProductos } from './insumos-productos';

describe('InsumosProductos', () => {
  let component: InsumosProductos;
  let fixture: ComponentFixture<InsumosProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
