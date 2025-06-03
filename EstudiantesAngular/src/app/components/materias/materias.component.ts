import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MateriasService } from '../../services/materias.service';
import { AuthService } from '../../services/auth.service';
import { Materia } from '../../interfaces/materia.interface';

@Component({
    selector: 'app-materias',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="app-container">
            <nav class="main-nav">
                <div class="nav-wrapper">
                    <h1 class="app-title">Sistema de Materias</h1>
                    <div class="user-section">
                        <span class="user-name">{{ email }}</span>
                        <button (click)="logout()" class="logout-button">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </nav>

            <div *ngIf="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
            <div *ngIf="successMessage" class="success-message">
                {{ successMessage }}
            </div>

            <main class="main-content">
                <div class="cards-grid">
                    <!-- Materias disponibles -->
                    <section class="card">
                        <div class="card-inner">
                            <h2 class="section-title">Materias Disponibles</h2>
                            <div class="materias-list">
                                <article *ngFor="let materia of materiasDisponibles" 
                                    class="materia-card">
                                    <h3 class="materia-title">{{ materia.name }}</h3>
                                    <p class="materia-teacher">Profesor ID: {{ materia.teacherId }}</p>
                                    <p class="materia-credits">Créditos: {{ materia.credits }}</p>
                                    <button (click)="registrarMateria(materia.id)"
                                        class="action-button register">
                                        Registrar
                                    </button>
                                </article>
                            </div>
                        </div>
                    </section>

                    <!-- Materias registradas -->
                    <section class="card">
                        <div class="card-inner">
                            <h2 class="section-title">Mis Materias</h2>
                            <div class="materias-list">
                                <article *ngFor="let materia of materiasRegistradas" 
                                    class="materia-card">
                                    <h3 class="materia-title">{{ materia.name }}</h3>
                                    <p class="materia-teacher">Profesor ID: {{ materia.teacherId }}</p>
                                    <p class="materia-credits">Créditos: {{ materia.credits }}</p>
                                    <button (click)="eliminarRegistro(materia.id)"
                                        class="action-button delete">
                                        Eliminar
                                    </button>
                                </article>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    `,
    styles: [`
        .app-container {
            min-height: 100vh;
            background-color: #f0f2f5;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .main-nav {
            background: linear-gradient(120deg, #2c3e50, #3498db);
            color: white;
            padding: 1rem 0;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .nav-wrapper {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .app-title {
            font-size: 24px;
            font-weight: 600;
            margin: 0;
        }

        .user-section {
            display: flex;
            align-items: center;
            gap: 20px;
        }

        .user-name {
            font-size: 16px;
        }

        .logout-button {
            background-color: rgba(255, 255, 255, 0.15);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .logout-button:hover {
            background-color: rgba(255, 255, 255, 0.25);
            transform: translateY(-1px);
        }

        .main-content {
            max-width: 1200px;
            margin: 2rem auto;
            padding: 0 20px;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
        }

        .card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            transition: transform 0.3s ease;
        }

        .card:hover {
            transform: translateY(-5px);
        }

        .card-inner {
            padding: 1.5rem;
        }

        .section-title {
            color: #2c3e50;
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 1.5rem;
            padding-bottom: 0.5rem;
            border-bottom: 2px solid #ecf0f1;
        }

        .materias-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }

        .materia-card {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 1rem;
            transition: all 0.3s ease;
        }

        .materia-card:hover {
            background: #fff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .materia-title {
            color: #34495e;
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 0.5rem;
        }

        .materia-teacher, .materia-credits {
            color: #7f8c8d;
            font-size: 14px;
            margin-bottom: 0.5rem;
        }

        .action-button {
            width: 100%;
            padding: 8px 16px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .action-button.register {
            background-color: #3498db;
            color: white;
        }

        .action-button.register:hover {
            background-color: #2980b9;
        }

        .action-button.delete {
            background-color: #e74c3c;
            color: white;
        }

        .action-button.delete:hover {
            background-color: #c0392b;
        }

        @media (max-width: 768px) {
            .nav-wrapper {
                flex-direction: column;
                gap: 1rem;
                text-align: center;
            }

            .user-section {
                flex-direction: column;
            }

            .cards-grid {
                grid-template-columns: 1fr;
            }

            .card {
                margin-bottom: 1rem;
            }
        }

        @media (max-width: 480px) {
            .main-content {
                padding: 0 10px;
            }

            .card-inner {
                padding: 1rem;
            }
        }

        .error-message, .success-message {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        }

        .error-message {
            background-color: #ff4757;
            color: white;
            box-shadow: 0 2px 10px rgba(255, 71, 87, 0.3);
        }

        .success-message {
            background-color: #2ecc71;
            color: white;
            box-shadow: 0 2px 10px rgba(46, 204, 113, 0.3);
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `]
})
export class MateriasComponent implements OnInit {
    materiasDisponibles: Materia[] = [];
    materiasRegistradas: Materia[] = [];
    email: string = '';
    userId: number = 0;
    errorMessage: string = '';
    successMessage: string = '';

    constructor(
        private materiasService: MateriasService,
        private authService: AuthService,
        private router: Router
    ) {
        const email = this.authService.getCurrentUser();
        const idUser = this.authService.getCurrentId();

        if (email) {
            this.email = `${email}`;
            this.userId = idUser;
        }
    }

    private showMessage(message: string, isError: boolean = false) {
        if (isError) {
            this.errorMessage = message;
            setTimeout(() => this.errorMessage = '', 5000);
        } else {
            this.successMessage = message;
            setTimeout(() => this.successMessage = '', 5000);
        }
    }

    ngOnInit() {
         this.cargarMaterias();
        this.cargarMateriasRegistradas();
    }

    cargarMaterias() {
        this.materiasService.getMaterias(this.userId).subscribe({
            next: (materias) => {
                console.log('Materias cargadas:', materias);
                this.materiasDisponibles = materias;
            },
            error: (error) => {
                console.error('Error al cargar materias:', error);
                this.showMessage('Error al cargar las materias disponibles', true);
            }
        });
    }

    cargarMateriasRegistradas() {
        this.materiasService.getMateriasByEstudiante(this.userId).subscribe({
            next: (materias) => {
                console.log('Materias registradas cargadas:', materias);
                this.materiasRegistradas = materias;
            },
            error: (error) => {
                console.error('Error al cargar materias registradas:', error);
                this.showMessage('Error al cargar tus materias registradas', true);
            }
        });
    }

    registrarMateria(materiaId: number) {
        console.log('Intentando registrar materia:', materiaId);
        this.materiasService.registrarMateria({
            IdStudent: this.userId,
            IdSubject: materiaId
        }).subscribe({
            next: () => {
                console.log('Materia registrada exitosamente');
                this.showMessage('Materia registrada exitosamente');
                this.cargarMaterias();
                this.cargarMateriasRegistradas();
            },
            error: (error) => {
                console.error('Error al registrar materia:', error);
                this.showMessage(error.message || 'Error al registrar la materia', true);
            }
        });
    }

    eliminarRegistro(materiaId: number) {
        console.log('Intentando eliminar registro:', materiaId);
        this.materiasService.eliminarRegistro(this.userId, materiaId).subscribe({
            next: () => {
                console.log('Registro eliminado exitosamente');
                this.showMessage('Materia eliminada exitosamente');
                this.cargarMaterias();
                this.cargarMateriasRegistradas();
            },
            error: (error) => {
                console.error('Error al eliminar registro:', error);
                this.showMessage('Error al eliminar la materia', true);
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
} 