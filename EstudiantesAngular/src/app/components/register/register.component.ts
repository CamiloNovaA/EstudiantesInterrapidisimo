import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
        <div class="register-container">
            <div class="register-box">
                <h2>Registro</h2>
                <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
                    <div class="form-group">
                        <label>Nombre</label>
                        <input type="text" formControlName="nombre">
                        <div *ngIf="registerForm.get('nombre')?.errors?.['required'] && registerForm.get('nombre')?.touched"
                            class="error-message">
                            El nombre es requerido
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Apellido</label>
                        <input type="text" formControlName="apellido">
                        <div *ngIf="registerForm.get('apellido')?.errors?.['required'] && registerForm.get('apellido')?.touched"
                            class="error-message">
                            El apellido es requerido
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" formControlName="email">
                        <div *ngIf="registerForm.get('email')?.errors?.['required'] && registerForm.get('email')?.touched"
                            class="error-message">
                            El email es requerido
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" formControlName="password">
                        <div *ngIf="registerForm.get('password')?.errors?.['required'] && registerForm.get('password')?.touched"
                            class="error-message">
                            La contraseña es requerida
                        </div>
                    </div>
                    <button type="submit" [disabled]="registerForm.invalid" class="submit-btn">
                        Registrarse
                    </button>
                    <div class="login-link">
                        <a routerLink="/login">¿Ya tienes cuenta? Inicia sesión</a>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: [`
        .register-container {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #a777e3, #6e8efb);
        }

        .register-box {
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 400px;
        }

        h2 {
            text-align: center;
            color: #333;
            margin-bottom: 1.5rem;
            font-size: 1.8rem;
        }

        .form-group {
            margin-bottom: 1.2rem;
        }

        label {
            display: block;
            margin-bottom: 0.5rem;
            color: #555;
            font-weight: 500;
        }

        input {
            width: 100%;
            padding: 0.8rem;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }

        input:focus {
            outline: none;
            border-color: #a777e3;
            box-shadow: 0 0 0 2px rgba(167, 119, 227, 0.1);
        }

        .error-message {
            color: #dc3545;
            font-size: 0.85rem;
            margin-top: 0.3rem;
        }

        .submit-btn {
            width: 100%;
            padding: 0.8rem;
            background: #a777e3;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
            background: #9461d3;
        }

        .submit-btn:disabled {
            background: #d4b6f0;
            cursor: not-allowed;
        }

        .login-link {
            text-align: center;
            margin-top: 1rem;
        }

        .login-link a {
            color: #a777e3;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .login-link a:hover {
            color: #9461d3;
        }
    `]
})
export class RegisterComponent {
    registerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private router: Router
    ) {
        this.registerForm = this.fb.group({
            nombre: ['', Validators.required],
            apellido: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit() {
        if (this.registerForm.valid) {
            this.authService.register(this.registerForm.value).subscribe({
                next: () => {
                    this.router.navigate(['/login']);
                },
                error: (error) => {
                    console.error('Error al registrar:', error);
                }
            });
        }
    }
} 