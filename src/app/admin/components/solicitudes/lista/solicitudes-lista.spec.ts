import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitudesLista } from './solicitudes-lista';

describe('SolicitudesLista', () => {
  let component: SolicitudesLista;
  let fixture: ComponentFixture<SolicitudesLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudesLista],
    }).compileComponents();

    fixture = TestBed.createComponent(SolicitudesLista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
