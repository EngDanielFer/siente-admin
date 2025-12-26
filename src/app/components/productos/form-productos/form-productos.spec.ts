import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductos } from './form-productos';

describe('FormProductos', () => {
  let component: FormProductos;
  let fixture: ComponentFixture<FormProductos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProductos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProductos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
