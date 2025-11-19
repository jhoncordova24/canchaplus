import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCancha } from './agregar-cancha';

describe('AgregarCancha', () => {
  let component: AgregarCancha;
  let fixture: ComponentFixture<AgregarCancha>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarCancha]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCancha);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
