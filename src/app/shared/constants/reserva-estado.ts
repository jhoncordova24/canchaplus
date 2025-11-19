export const EstadoReserva: Map<string, string> = new Map([
  ['1', 'Reservado'],
  ['2', 'Pagado'],
  ['3', 'Cancelado'],
  ['4', 'Aceptado'],
  ['5', 'Finalizado'],
]);
//Reservado->Aceptado->Pagado->Finalizado
//Reservado->Cancelado/Aceptado->Cancelado/Pagado->Finalizado
//Da flojera otro service para 3 estaticos
