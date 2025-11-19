import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc, getDocs } from '@angular/fire/firestore';
import { SolicitudAdmin } from '../../interfaces/solicitud.interface';
import { environment } from '../../../environments/environment';
import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';
import { from, Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AscensoService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);
  private readonly collection = environment.baseSolicitudCollection;

  uploadImage(file: File, idUsuario: string | number): Observable<string> {
    const filePath = `solicitudes/${idUsuario}/${file.name}`;
    const storageRef = ref(this.storage, filePath);

    const uploadTask = uploadBytes(storageRef, file);
    //Se devuevle la url si se necesita  o no?
    return from(uploadTask).pipe(switchMap((snapshot) => getDownloadURL(snapshot.ref)));
  }

  async create(data: Omit<SolicitudAdmin, 'id'>): Promise<string> {
    const colRef = collection(this.firestore, this.collection);
    const payload = {
      ...data,
      estado: data.estado ?? 'pendiente',
      createdAt: Date.now(),
    };
    const ref = await addDoc(colRef, payload);
    return ref.id;
  }

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
}
