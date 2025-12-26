import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGanancias } from './tabla-ganancias';

describe('TablaGanancias', () => {
  let component: TablaGanancias;
  let fixture: ComponentFixture<TablaGanancias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaGanancias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaGanancias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
