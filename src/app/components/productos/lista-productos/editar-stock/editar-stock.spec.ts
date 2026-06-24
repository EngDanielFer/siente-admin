import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarStock } from './editar-stock';

describe('EditarStock', () => {
  let component: EditarStock;
  let fixture: ComponentFixture<EditarStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
