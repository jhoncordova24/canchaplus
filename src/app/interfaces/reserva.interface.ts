export interface Reserva {
  reserva_id?: number | string;
  cancha_id: number | string;
  usuario_id: number | string;
  reserva_fecha: string | Date;
  reserva_horainicio: string;
  reserva_horafin: string;
  estadoreserva_id: number | string;
  reserva_montototal: number;
  estadoreserva_nombre?: string;
  tipocancha_nombre?: string;
  cancha_nombre?: string;
}
