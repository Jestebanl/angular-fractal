import { Routes } from '@angular/router';
import { authRoutes } from './auth/auth.routes';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () =>
            import('./features/maker/layout/layout.component'),
    },
    ...authRoutes,
    { path: '**', redirectTo: '' }
];
