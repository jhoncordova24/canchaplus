import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarCanchaDialog } from './agregar-cancha-dialog';

describe('AgregarCanchaDialog', () => {
  let component: AgregarCanchaDialog;
  let fixture: ComponentFixture<AgregarCanchaDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgregarCanchaDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgregarCanchaDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
