import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
        <div class="login-container">
            <div class="login-box">
                <h2>Iniciar Sesión</h2>
                <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" formControlName="email">
                        <div *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched"
                            class="error-message">
                            El email es requerido
                        </div>
                    </div>
                    <div class="form-group">
                        <label>Contraseña</label>
                        <input type="password" formControlName="password">
                        <div *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched"
                            class="error-message">
                            La contraseña es requerida
                        </div>
                    </div>
                    <button type="submit" [disabled]="loginForm.invalid" class="submit-btn">
                        Ingresar
                    </button>
                    <div class="register-link">
                        <a routerLink="/register">¿No tienes cuenta? Regístrate</a>
                    </div>
                </form>
            </div>
        </div>
    `,
    styles: [`
        .login-container {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #6e8efb, #a777e3);
        }

        .login-box {
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
            border-color: #6e8efb;
            box-shadow: 0 0 0 2px rgba(110, 142, 251, 0.1);
        }

        .error-message {
            color: #dc3545;
            font-size: 0.85rem;
            margin-top: 0.3rem;
        }

        .submit-btn {
            width: 100%;
            padding: 0.8rem;
            background: #6e8efb;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
            background: #5a7af0;
        }

        .submit-btn:disabled {
            background: #b4c2fb;
            cursor: not-allowed;
        }

        .register-link {
            text-align: center;
            margin-top: 1rem;
        }

        .register-link a {
            color: #6e8efb;
            text-decoration: none;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .register-link a:hover {
            color: #5a7af0;
        }
    `]
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
                }
            });
        }
    }
} 