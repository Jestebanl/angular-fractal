import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, user } from '@angular/fire/auth';
import { FirebaseError } from '@angular/fire/app';
import { Firestore, collection, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _auth = inject(Auth);
  private _firestore = inject(Firestore);
  
  isLoggedIn(): Observable<boolean> {
    return user(this._auth).pipe(
      map(user => !!user)
    );
  }

  async signIn({ email, password }: { email: string; password: string }){
    try {
      const userCredential = await signInWithEmailAndPassword(this._auth, email, password);
      return { ...userCredential };
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw error;
      }
      throw new Error('Error de autenticación desconocido');
    }
  }
}
