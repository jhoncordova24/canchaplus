import { Component, inject, OnInit } from '@angular/core';
import { CanchaService } from '../../../services/cancha.service';
import { Cancha } from '../../../../interfaces/cancha.interface';
import { Hora } from './tiempo.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { CryptoService } from '../../../services/crypto.service';
import { Reserva } from '../../../../interfaces/reserva.interface';
import { addHours, format, parse } from 'date-fns';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { horasReserva } from '../../../../shared/constants/horas-reservar';
import { TipoCanchas } from '../../../../shared/constants/cancha-tipos';
import { TarifaService } from '../../../services/tarifa.service';
import { fromZonedTime } from 'date-fns-tz';
import { Tarifa } from '../../../../interfaces/tarifa.interface';
import { UserService } from '../../../../core/services/user.service';
import { User } from '../../../../interfaces/user.interface';
import { ReservaService } from '../../../services/reserva.service';

@Component({
  selector: 'app-confirmar',
  imports: [ReactiveFormsModule],
  templateUrl: './confirmar.html',
  styleUrl: './confirmar.scss',
})
export class Confirmar implements OnInit {
  form!: FormGroup;
  cancha!: Cancha;
  reserva!: Reserva;
  horas: Hora[] = horasReserva;
  tarifa!: Tarifa;
  private idCancha!: number;
  private fechaReserva!: string;
  hoy: string = format(fromZonedTime(new Date(), 'America/Lima'), 'yyyy-MM-dd');
  user!: User;

  private readonly canchaService = inject(CanchaService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly cryptoService = inject(CryptoService);
  private readonly tarifaService = inject(TarifaService);
  private readonly reservaService = inject(ReservaService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);

  constructor() {
    this.activatedRoute.params.subscribe((params) => {
      this.idCancha = parseInt(this.cryptoService.desencriptar(params['idCancha']));
      this.fechaReserva = params['fecha'];
    });
    this.form = this.formBuilder.group({
      cancha_id: this.formBuilder.control<string>('', Validators.required),
      usuario_id: this.formBuilder.control<string>('', Validators.required),
      reserva_fecha: this.formBuilder.control<string>('', Validators.required),
      reserva_horainicio: this.formBuilder.control<string>('', Validators.required),
      reserva_horafin: this.formBuilder.control<string>('', Validators.required),
      estadoreserva_id: this.formBuilder.control<string>('2', Validators.required),
      horas: this.formBuilder.control<number>(1, Validators.required),
      reserva_montototal: this.formBuilder.control<number>(0, Validators.required),
    });
  }

  ngOnInit(): void {
    this.getUser();
    this.reserva = {
      cancha_id: this.idCancha,
      usuario_id: this.user.usuario_id,
      reserva_fecha: format(this.fechaReserva, 'yyyy-MM-dd'),
      reserva_horainicio: format(this.fechaReserva, 'hh:mm:ss'),
      reserva_horafin: '',
      estadoreserva_id: 1,
      reserva_montototal: 0,
    };
    this.form.patchValue(this.reserva);
    this.getCanchaSelected();
    console.log(this.form.value);
    this.getTarifa(this.idCancha.toString());
  }

  getTarifa(idCancha: string) {
    this.tarifaService.getTarifaByCanchaId(idCancha, this.hoy).subscribe({
      next: (response: any) => {
        console.log('La tarifa', response.data);
        this.tarifa = response.data[0];
      },
    });
  }

  getCanchaSelected() {
    this.canchaService.getCanchaById(this.idCancha).subscribe({
      next: (response: any) => {
        console.log(response);
        this.cancha = response.data;
        //Los id vienen como string....
        this.cancha.tipocancha_nombre = TipoCanchas.get(
          parseInt(this.cancha.tipocancha_id as string)
        );
      },
    });
  }

  getPrecioTotal(): number {
    const horas = Number(this.form.get('horas')?.value ?? 0);
    const tarifa = Number(this.tarifa.tarifa_preciohora ?? 0);
    const precio = horas * tarifa;
    this.form.get('reserva_montototal')?.patchValue(precio);
    return precio;
  }

  getUser() {
    this.user = this.userService.getUser();
  }

  validateHour(data: any) {
    const fecha = data.reserva_fecha;
    const horaInicio = data.reserva_horainicio;
    const duracion = data.horas;
    const fechaHoraInicioStr = `${fecha} ${horaInicio}`;
    const fechaHoraInicio = parse(fechaHoraInicioStr, 'yyyy-MM-dd HH:mm:ss', new Date());
    const fechaHoraFin = addHours(fechaHoraInicio, duracion);
    const horaFin = format(fechaHoraFin, 'HH:mm:ss');
    this.form.get('reserva_horafin')!.setValue(horaFin);
  }

  addReserva(data: Reserva) {
    this.reservaService.addReserva(data).subscribe({
      next: (response: any) => {
        console.log(response);
      },
    });
  }

  ngSubmit() {
    this.validateHour(this.form.value);
    if (this.form.valid) {
      const data = this.form.value;
      this.addReserva(data);
    } else {
      console.log('No valido:', this.form.value);
    }
  }
}
