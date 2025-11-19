export interface Reserva {
  cancha_id: number;
  usuario_id: number | string;
  reserva_fecha: string | Date;
  reserva_horainicio: string;
  reserva_horafin: string;
  estadoreserva_id: number;
  reserva_montototal:number
}
