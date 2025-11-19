import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudesDetalle } from './solicitudes-detalle';

describe('SolicitudesDetalle', () => {
  let component: SolicitudesDetalle;
  let fixture: ComponentFixture<SolicitudesDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesDetalle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudesDetalle);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
