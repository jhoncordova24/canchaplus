import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private readonly secretCryptoJS = environment.secretCryptoJS;

  encriptar(texto: string): string {
    return CryptoJS.AES.encrypt(texto, this.secretCryptoJS).toString();
  }

  desencriptar(cifrado: string): string {
    const bytes = CryptoJS.AES.decrypt(cifrado, this.secretCryptoJS);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
