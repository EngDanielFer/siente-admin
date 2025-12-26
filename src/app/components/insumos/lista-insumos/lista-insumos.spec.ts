import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInsumos } from './lista-insumos';

describe('ListaInsumos', () => {
  let component: ListaInsumos;
  let fixture: ComponentFixture<ListaInsumos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaInsumos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaInsumos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
