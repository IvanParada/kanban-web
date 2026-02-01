import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { publicGuard } from './core/guards/public.guard';
import { PublicLayoutComponent } from './shared/components/public-layout-component/public-layout.component';
import { PrivateLayoutComponent } from './shared/components/private-layout-component/private-layout.component';

export const routes: Routes = [
    {
        path: 'auth',
        component: PublicLayoutComponent,
        canActivate: [publicGuard],
        children: [
            {
                path: 'login',
                loadComponent: () =>
                    import('./features/auth/login/login.component')
            },
            {
                path: 'register',
                loadComponent: () =>
                    import('./features/auth/register/register.component')
            },
            { path: '', pathMatch: 'full', redirectTo: 'login' },
        ],
    },

    {
        path: '',
        component: PrivateLayoutComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () =>
                    import('./features/task/task.component'),
            },
            // aquí puedes agregar más rutas privadas:
            // { path: 'board', loadComponent: () => import(...).then(m => m.BoardComponent) },
        ],
    },

    { path: '**', redirectTo: '' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
