import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export default class RegisterComponent {
    private _fb = inject(FormBuilder);
    private _authService = inject(AuthService);
    private _router = inject(Router);

    registerForm: FormGroup = this._fb.group({
        name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
    });

    errorMessage = signal<string | null>(null);

    onSubmit() {
        if (this.registerForm.invalid) {
            this.registerForm.markAllAsTouched();
            return;
        }

        const { name, email, password } = this.registerForm.value;

        this._authService.register(name, email, password).subscribe({
            next: () => {
                this._router.navigateByUrl('/');
            },
            error: (err) => {
                this.errorMessage.set('Registro fallido. Por favor, intenta de nuevo.');
                setTimeout(() => this.errorMessage.set(null), 3000);
            }
        });
    }
}
