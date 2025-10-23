import { Injectable } from '@angular/core';
import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  //HEADERS - COLUMNAS
  public override weekViewColumnHeader({ date }: DateFormatterParams): string {
    return (
      format(date, 'EEEE', { locale: es }).charAt(0).toUpperCase() +
      format(date, 'EEEE', { locale: es }).slice(1)
    ); // 'EEE' para el nombre abreviado del día de la semana
  }
  public override monthViewColumnHeader({ date }: DateFormatterParams): string {
    return (
      format(date, 'EEEE', { locale: es }).charAt(0).toUpperCase() +
      format(date, 'EEEE', { locale: es }).slice(1)
    ); // 'EEE' es para el nombre abreviado del día
  }

  //TITULOS
  public override monthViewTitle({ date }: DateFormatterParams): string {
    return (
      format(date, 'MMMM yyyy', { locale: es }).charAt(0).toUpperCase() +
      format(date, 'MMMM yyyy', { locale: es }).slice(1)
    ); //Mostrar primera letra en mayuscula y español..
  }

  public override weekViewTitle({ date, locale }: DateFormatterParams): string {
    return (
      format(startOfWeek(date, { locale: es }), 'dd', { locale: es }) +
      ' - ' +
      format(endOfWeek(date, { locale: es }), 'dd', { locale: es }) +
      ' ' +
      format(date, 'MMMM', { locale: es }).charAt(0).toUpperCase() +
      format(date, 'MMMM', { locale: es }).slice(1)
    );
  }

  public override weekViewColumnSubHeader({
    date,
  }: DateFormatterParams): string {
    // Formatea el día de la semana en español
    return (
      format(date, 'dd', { locale: es }) +
      ' ' +
      format(date, 'MMM', { locale: es }).charAt(0).toUpperCase() +
      format(date, 'MMM', { locale: es }).slice(1)
    );
  }

  public override weekViewHour({ date }: DateFormatterParams): string {
    return format(date, 'HH:mm', { locale: es }); //Formato 24h
  }

  public override dayViewTitle({ date, locale }: DateFormatterParams): string {
    return (
      format(date, 'EEE', { locale: es }).charAt(0).toUpperCase() +
      format(date, 'EEEE', { locale: es }).slice(1) +
      ' ' +
      format(date, 'dd', { locale: es }) +
      ' ' +
      format(date, 'MMMM', { locale: es }).charAt(0).toUpperCase() +
      format(date, 'MMMM yyyy', { locale: es }).slice(1)
    );
    //return format(date, 'EEEE dd MMMM yyyy', { locale: es });
  }
  public override dayViewHour({ date }: DateFormatterParams): string {
    return format(date, 'HH:mm', { locale: es }); //Formato 24h
  }
}
export const calendarParameters = {
  dayStartHour: 6,
  dayEndHour: 23,
  hourSegments: 2,
  startsOn: 1,
};
