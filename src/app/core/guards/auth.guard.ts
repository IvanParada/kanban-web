import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../models/auth.models';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const status = authService.authStatus();

    if (status === AuthStatus.authenticated) return true;

    if (status === AuthStatus.checking) {
        return authService.checkAuthStatus().pipe(
            map((ok) => ok ? true : router.parseUrl('/auth/login'))
        );
    }

    return router.parseUrl('/auth/login');
};
