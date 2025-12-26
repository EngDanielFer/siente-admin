import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormInsumos } from './form-insumos';

describe('FormInsumos', () => {
  let component: FormInsumos;
  let fixture: ComponentFixture<FormInsumos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormInsumos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormInsumos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
