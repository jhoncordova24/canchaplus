export interface User {
  usuario_id: number;
  usuario_correo: string;
  usuario_nombres: string;
  usuario_rol: number | string;
  usuario_fecharegistro?: string;
  usuario_telefono?: string;
  usuario_rolNombre?: string;
}
