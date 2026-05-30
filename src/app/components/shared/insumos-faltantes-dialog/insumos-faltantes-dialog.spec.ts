import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsumosFaltantesDialog } from './insumos-faltantes-dialog';

describe('InsumosFaltantesDialog', () => {
  let component: InsumosFaltantesDialog;
  let fixture: ComponentFixture<InsumosFaltantesDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsumosFaltantesDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsumosFaltantesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
