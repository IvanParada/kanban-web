import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../models/auth.models';
import { map } from 'rxjs';

export const publicGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const status = authService.authStatus();

    if (status === AuthStatus.authenticated) return router.parseUrl('/');

    if (status === AuthStatus.checking) {
        return authService.checkAuthStatus().pipe(
            map(ok => ok ? router.parseUrl('/') : true)
        );
    }

    return true;
};
