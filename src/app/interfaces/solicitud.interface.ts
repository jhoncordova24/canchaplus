export interface SolicitudAdmin {
  id?: string;
  nombre: string;
  correo: string;
  telefono: string;
  motivo: string;
  experiencia?: string;
  estado?: 'pendiente' | 'aprobado' | 'rechazado';
  createdAt?: number;
  idUsuario: string;
  imgUrl?: string;
}
