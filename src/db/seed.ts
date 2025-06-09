import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

/* 
He usado estos comandos para poder usar seed.ts:
npx tsc src/db/seed.ts
node src/db/seed.js
*/

// Firebase configuration - usando la configuración correcta de tu app.config.ts
const firebaseConfig = {
  projectId: "aplicacionfractal",
  appId: "1:718383008770:web:6873a6d01f35eb3bf82b1b",
  storageBucket: "aplicacionfractal.firebasestorage.app",
  apiKey: "AIzaSyA15L-YkV4ElcrCcpVM3tRe-ee8qUN9VYA",
  authDomain: "aplicacionfractal.firebaseapp.com",
  messagingSenderId: "718383008770"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ...existing interfaces...

// Toast interface
export interface Toast {
  backgroundColor: string;
  iconBackgroundColor: string;
  iconColor: string;
  iconDescription: string;
  iconPath: string;
  textColor: string;
}

// Componente interface
export interface Componente {
  categoria: string;
  descripcion: string;
  nombre: string;
  ruta: string;
  tipo: string;
  toastReferenciado: string;
}

/**
 * Seeds toast data into the Firestore database
 */
const seedToasts = async (): Promise<void> => {
  try {
    console.log('Seeding toasts to database...');
    const toastsCollection = collection(db, 'Toast');
    
    // Import toast data from the sample-toast-data file
    const { toasts } = await import('./sample-toast-data');
    
    for (const [toastId, toastData] of Object.entries(toasts)) {
      await addDoc(toastsCollection, toastData);
      console.log(`Added toast: ${toastId}`);
    }
    
    console.log('Toast seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding toasts:', error);
    throw error;
  }
};

/**
 * Seeds component data into the Firestore database
 */
const seedComponents = async (): Promise<void> => {
  try {
    console.log('Seeding components to database...');
    const componentsCollection = collection(db, 'Componente');
    
    // Import component data from the sample-component-data file
    const { componentes } = await import('./sample-component-data');
    
    for (const componente of componentes) {
      await addDoc(componentsCollection, componente);
      console.log(`Added component: ${componente.nombre}`);
    }
    
    console.log('Component seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding components:', error);
    throw error;
  }
};

// ...existing functions (seedUsers, seedEvents)...

// Updated main seeding function
export const seedDatabase = async (): Promise<void> => {
  try {
    await seedToasts();
    await seedComponents();
    console.log('Database seeding completed!');
  } catch (error) {
    console.error('Failed to seed database:', error);
    throw error;
  }
};

// Run when script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seedDatabase;