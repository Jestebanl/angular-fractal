import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({ projectId: "aplicacionfractal", appId: "1:718383008770:web:6873a6d01f35eb3bf82b1b", storageBucket: "aplicacionfractal.firebasestorage.app", apiKey: "AIzaSyA15L-YkV4ElcrCcpVM3tRe-ee8qUN9VYA", authDomain: "aplicacionfractal.firebaseapp.com", messagingSenderId: "718383008770" })), provideAuth(() => getAuth()), provideFirestore(() => getFirestore())]
};
