import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ganancias } from './ganancias';

describe('Ganancias', () => {
  let component: Ganancias;
  let fixture: ComponentFixture<Ganancias>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ganancias]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ganancias);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
