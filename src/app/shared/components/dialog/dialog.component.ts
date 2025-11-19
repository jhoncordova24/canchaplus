import { Component, input, OnInit, output } from '@angular/core';
import { DataDialog, Result } from '../../../interfaces/data-dialog.interface';

@Component({
  selector: 'app-dialog-component',
  imports: [],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss',
  standalone: true,
})
export class DialogComponent {
  //  DataDialog {
  //   body: string; cuerpo del mensaje
  //   title: string; titulo del dialogo
  //   actions: boolean; se muestran las acciones de confirmar y cancelar o solo un boton de cerrar
  //   icon?: string; icono opcional para el dialogo -- No implementado aun en template
  //   confirmLabel?: string; etiqueta del boton de confirmar
  //   discardLabel?: string; etiqueta del boton de cancelar
  //   payload?: any; datos adicionales que se pueden enviar al cerrar el dialogo
  // }

  // interface Result {
  //   result: boolean; indica si se confirmo o cancelo la accion
  //   body?: any; datos adicionales que se pueden enviar al cerrar el dialogo
  // }

  isOpen = input.required<boolean>();

  onCloseModal = output<Result>();

  dataModal = input.required<DataDialog>();

  onClose(): void {
    const result: Result = { result: false, body: this.dataModal().payload || {} };
    this.onCloseModal.emit(result);
  }

  onConfirmAction(): void {
    const result: Result = {
      result: true,
      body: this.dataModal().payload,
    };
    this.onCloseModal.emit(result);
  }

  onBackdropClick(event: Event): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onClose();
    }
  }
}
