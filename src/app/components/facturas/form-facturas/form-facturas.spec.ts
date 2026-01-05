import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFacturas } from './form-facturas';

describe('FormFacturas', () => {
  let component: FormFacturas;
  let fixture: ComponentFixture<FormFacturas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFacturas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFacturas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
