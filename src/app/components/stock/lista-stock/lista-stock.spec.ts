import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaStock } from './lista-stock';

describe('ListaStock', () => {
  let component: ListaStock;
  let fixture: ComponentFixture<ListaStock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaStock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaStock);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
