import { Tarifa } from "./tarifa.interface";

export interface Cancha {
  cancha_id: number | string;
  cancha_nombre: string;
  tipocancha_id: number | string;
  usuario_id: number;
  cancha_estado: string;
  tipocancha_nombre?: string;
  tarifaActual ?: Tarifa;
}
