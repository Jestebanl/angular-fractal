import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData } from '@angular/fire/firestore';
import { collection, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from '../../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComponenteService {
  constructor(
    private firestore: Firestore,
    private authService: AuthService
  ) {}

  getComponentes(): Observable<any[]> {
    return this.authService.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          const componentesCollection = collection(this.firestore, 'Componente');
          return collectionData(componentesCollection, { idField: 'id' });
        } else {
          throw new Error('Usuario no autenticado');
        }
      })
    );
  }

  getToastReferenciado(toastId: string): Observable<any> {
    return this.authService.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          const toastDocRef = doc(this.firestore, `Toast/${toastId}`);
          return docData(toastDocRef);
        } else {
          throw new Error('Usuario no autenticado');
        }
      })
    );
  }

  getComponenteConToast(componente: any): Observable<{componente: any, toast: any}> {
    return this.authService.isLoggedIn().pipe(
      switchMap(isLoggedIn => {
        if (isLoggedIn) {
          const toastDocRef = doc(this.firestore, `Toast/${componente.toastReferenciado.id}`);
          return docData(toastDocRef).pipe(
            switchMap(toastData => {
              return new Observable<{componente: any, toast: any}>(observer => {
                observer.next({
                  componente: componente,
                  toast: toastData
                });
                observer.complete();
              });
            })
          );
        } else {
          throw new Error('Usuario no autenticado');
        }
      })
    );
  }
}
