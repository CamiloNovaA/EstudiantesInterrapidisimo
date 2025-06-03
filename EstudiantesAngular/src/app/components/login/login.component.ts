import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
            <div class="bg-white p-8 rounded-lg shadow-md w-96">
                <h2 class="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" formControlName="email" 
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <div *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched"
                            class="text-red-500 text-sm mt-1">
                            El email es requerido
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input type="password" formControlName="password"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <div *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched"
                            class="text-red-500 text-sm mt-1">
                            La contraseña es requerida
                        </div>
                    </div>
                    <button type="submit" [disabled]="loginForm.invalid"
                        class="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                        Ingresar
                    </button>
                    <div class="text-center mt-4">
                        <a routerLink="/register" class="text-indigo-600 hover:text-indigo-800">
                            ¿No tienes cuenta? Regístrate
                        </a>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: []
})
export class LoginComponent {
    loginForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/materias']);
                },
                error: (error) => {
                    console.error('Error al iniciar sesión:', error);
                    // Aquí podrías mostrar un mensaje de error al usuario
                }
            });
        }
    }
} 