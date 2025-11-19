export const EstadoReserva: Map<string, string> = new Map([
  ['1', 'Pendiente'],
  ['2', 'Pagado'],
  ['3', 'Anulado'],
  ['4', 'Aceptado'],
  ['5', 'Finalizado'],
]);
//Reservado->Aceptado->Pagado->Finalizado
//Reservado->Anulado/Aceptado->Anulado/Pagado->Finalizado
//Da flojera otro service para 3 estaticos
