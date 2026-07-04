import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaInsumosBajos } from './alerta-insumos-bajos';

describe('AlertaInsumosBajos', () => {
  let component: AlertaInsumosBajos;
  let fixture: ComponentFixture<AlertaInsumosBajos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaInsumosBajos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaInsumosBajos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
