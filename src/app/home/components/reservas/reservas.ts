import { Component, inject, OnInit } from '@angular/core';
import { Calendario } from '../calendario/calendario';
import { format } from 'date-fns';
import { ReservaService } from '../../services/reserva.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-reservas',
  imports: [Calendario],
  templateUrl: './reservas.html',
  styleUrl: './reservas.scss',
  standalone: true,
})
export class Reservas implements OnInit {
  reservas$: any;
  usuario!: User;

  private readonly reservaService = inject(ReservaService);
  private readonly userService = inject(UserService);

  ngOnInit(): void {
    this.usuario = this.userService.getUser();
    this.reservas$ = this.reservaService.getReservasByIdUsuario(this.usuario.usuario_id, 1, 100);
  }

  diaClicked(fecha: Date) {
    const fechaString = format(fecha, "yyyy-MM-dd'T'HH:mm:ss");
    // this.router.navigate(
    //   ['../../confirmar', this.cryptoService.encriptar(this.idCancha), fechaString],
    //   {
    //     relativeTo: this.activatedRoute,
    //   }
    // );
    console.log(fechaString);
  }
}
