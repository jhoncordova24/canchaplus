export const TipoRoles: Map<string, string> = new Map([
  ["1", 'Gerente'],
  ["2", 'Cliente'],
  ["3", 'Empleado'],//No existe este rol, el rol admin es exclusivo de firebase no estan en la misma bd
]);
//No existe tabla de roles no se puede llamar en service
