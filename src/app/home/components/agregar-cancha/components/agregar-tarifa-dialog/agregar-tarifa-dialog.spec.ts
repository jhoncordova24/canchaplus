import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarTarifaDialog } from './agregar-tarifa-dialog';

describe('AgregarTarifaDialog', () => {
  let component: AgregarTarifaDialog;
  let fixture: ComponentFixture<AgregarTarifaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarTarifaDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarTarifaDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
