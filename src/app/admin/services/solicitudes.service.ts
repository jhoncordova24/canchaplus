import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc, getDocs, updateDoc } from '@angular/fire/firestore';
import { CryptoService } from '../../home/services/crypto.service';
import { SolicitudAdmin } from '../../interfaces/solicitud.interface';
import { environment } from '../../../environments/environment';
import { listAll, ref, Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class SolicitudesService {
  private readonly firestore = inject(Firestore);
  private readonly collection = environment.baseSolicitudCollection;
  private readonly cryptoService = inject(CryptoService);
  private readonly storage = inject(Storage);

  //Se crean en ascenso desde el front de home/ascenso
  // async create(data: Omit<SolicitudAdmin, 'id'>): Promise<string> {
  //   const colRef = collection(this.firestore, this.collection);
  //   const payload = {
  //     ...data,
  //     estado: data.estado ?? 'pendiente',
  //     createdAt: Date.now(),
  //   };
  //   const ref = await addDoc(colRef, payload);
  //   return ref.id;
  // }

  async listAll(): Promise<SolicitudAdmin[]> {
    const colRef = collection(this.firestore, this.collection);
    const snap = await getDocs(colRef);
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as SolicitudAdmin) }));
  }

  async getSolicitudById(id: string): Promise<SolicitudAdmin | null> {
    const docRef = doc(this.firestore, this.collection, id);
    const snap = await getDoc(docRef);
    return snap.exists() ? (snap.data() as SolicitudAdmin) : null;
  }

  async updateSolicitud(id: string, partialData: Partial<SolicitudAdmin>): Promise<void> {
    const docRef = doc(this.firestore, this.collection, id);
    await updateDoc(docRef, {
      ...partialData,
      updatedAt: Date.now(), // opcional: registrar fecha de actualización
    });
  }
}
