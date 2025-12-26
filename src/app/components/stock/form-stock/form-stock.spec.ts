import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStock } from './form-stock';

describe('FormStock', () => {
  let component: FormStock;
  let fixture: ComponentFixture<FormStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
