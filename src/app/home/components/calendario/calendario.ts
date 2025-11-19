import { AsyncPipe } from '@angular/common';
import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import {
  CalendarA11y,
  CalendarDateFormatter,
  CalendarEvent,
  CalendarEventTitleFormatter,
  CalendarUtils,
  CalendarView,
  DateAdapter,
} from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { format } from 'date-fns';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { calendarParameters, CustomDateFormatter } from './calendar-config';
import {
  CalendarPreviousViewDirective,
  CalendarTodayDirective,
  CalendarNextViewDirective,
  CalendarMonthViewComponent,
  CalendarWeekViewComponent,
  CalendarDayViewComponent,
  CalendarDatePipe,
} from 'angular-calendar';
import { fromZonedTime } from 'date-fns-tz';
import { ActivatedRoute, Router } from '@angular/router';
import { EstadoReserva } from '../../../shared/constants/reserva-estado';

@Component({
  selector: 'app-calendario',
  imports: [
    AsyncPipe,
    CalendarPreviousViewDirective,
    CalendarTodayDirective,
    CalendarNextViewDirective,
    CalendarMonthViewComponent,
    CalendarWeekViewComponent,
    CalendarDayViewComponent,
    CalendarDatePipe,
  ],
  providers: [
    {
      provide: DateAdapter,
      useFactory: adapterFactory,
    },
    { provide: CalendarDateFormatter, useClass: CustomDateFormatter },
    CalendarUtils,
    CalendarA11y,
    CalendarEventTitleFormatter,
  ],
  templateUrl: './calendario.html',
  styleUrl: './calendario.scss',
  standalone: true,
})
export class Calendario implements OnInit {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  events$!: Observable<CalendarEvent<{ reserva: any }>[]>;
  reservas$ = input.required<Observable<any>>();

  fechaReserva = output<Date>();

  calendarParams = calendarParameters;

  viewDate: Date = new Date();

  fecha!: any;
  id: any;
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchEvents();
  }

  setView(view: CalendarView) {
    this.view = view;
    this.fetchEvents();
  }

  fetchEvents(): void {
    //Debo traerlas por mes pero backend no quiere avanzar
    this.events$ = this.reservas$().pipe(
      map((response: any) => {
        console.log(response);
        const reservas = response.data.reservas || response.data.lista || [];
        return reservas.map((r: any) => ({
          start: fromZonedTime(r.reserva_fecha + ' ' + r.reserva_horainicio, 'America/Lima'),
          end: fromZonedTime(r.reserva_fecha + ' ' + r.reserva_horafin, 'America/Lima'),
          title:
            EstadoReserva.get(r.estadoreserva_id) ||
            fromZonedTime(r.reserva_fecha + ' ' + r.reserva_horainicio, 'America/Lima'),
          meta: { reserva: r },
        }));
      }),
      catchError((err) => {
        console.error('Error al traer reservas', err);
        // Devuelves un array vacío o un valor especial para que el template no se quede colgado
        return of([]);
      })
    );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent<{ reserva: any }>[] }): void {
    //Esta es el dia pero SOLO en vista de Month
    //Setearemos la vista en Dia y podra agendar su reserva al seleccionar una hora
    this.setView(CalendarView.Day);
    this.viewDate = date;
  }
  // TOCA ESTO HACER DINAMICO PARA VISTAS DE RESERVAR Y LISTAR event day y otros de los horas de semana y dia VIEWS
  eventClicked(event: CalendarEvent<{ reserva: any }>): void {
    //Esta es la bolita
  }

  hourClicked(viewDate: Date) {
    this.fechaReserva.emit(viewDate);
  }
}
