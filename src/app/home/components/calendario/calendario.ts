import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
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
import { map, Observable } from 'rxjs';
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
export class Calendario {
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  events$!: Observable<CalendarEvent<{ cita: any }>[]>;

  calendarParams = calendarParameters;

  viewDate: Date = new Date();

  setView(view: CalendarView) {
    this.view = view;
    this.fetchEvents();
  }

  events: CalendarEvent[] = [];

  fetchEvents(): void {
    // this.events$ = new Observable<any>;
    // this.events$ = this.citaService.getCitasCalendario(this.view, this.viewDate)!.pipe(
    //   map((data: any) => {
    //     return data.data.map((cita: Cita) => {
    //       return {
    //         title:
    //           'Dr. ' +
    //           cita.medico.trabajador.persona.apellidoPaterno +
    //           ' - ' +
    //           cita.paciente.persona.nombrePrimer +
    //           ' ' +
    //           cita.paciente.persona.apellidoPaterno,
    //         start: new Date(cita.fecha),
    //         meta: {
    //           cita,
    //         },
    //       };
    //     });
    //   }),
    //   map((citas: any[]) => {
    //     return citas.filter((cita) => {
    //       console.log(cita);
    //       return cita.meta.cita.estadoCita.id != 2;
    //     });
    //   })
    // );
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent<{ cita: any }>[] }): void {
    //Dialogo form para agregar cita se le debe pasar un obj fecha con la fecha sin hora....
    //this.dialog.open(CalendarTestAloneComponent);
    //console.log(events[0]);
    const fecha = format(date, 'yyyy-MM-dd');
    // this.mostrarDialogAgregarCita({ data: fecha });
  }

  eventClicked(event: CalendarEvent<{ cita: any }>): void {
    //Dialogo con lista de citas con opcion de visualizar el detalle de cada una(otro dialogo??)....
    //this.dialog.open(CalendarTestAloneComponent);
    console.log(event);
    // this.mostrarDialogListaDia({ data: event.start });
  }
}
