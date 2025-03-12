import { inject, Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { FirebaseError } from 'firebase/app';
import { Firestore, collection, doc, getDoc, getDocs, query, setDoc, where } from '@angular/fire/firestore';

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
