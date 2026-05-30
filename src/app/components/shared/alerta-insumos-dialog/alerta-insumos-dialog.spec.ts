import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertaInsumosDialog } from './alerta-insumos-dialog';

describe('AlertaInsumosDialog', () => {
  let component: AlertaInsumosDialog;
  let fixture: ComponentFixture<AlertaInsumosDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertaInsumosDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertaInsumosDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
