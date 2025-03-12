import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    //canActivateChild: [publicGuard()],
    path: 'auth',
    loadComponent: () => import('./layout/layout.component'),
    children: [
      {
        path: 'login',
        loadComponent: () => import('./login/login.component'),
      }
    ],
  },
];
