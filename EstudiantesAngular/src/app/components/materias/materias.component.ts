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
        <div class="min-h-screen bg-gray-100">
            <nav class="bg-white shadow-lg">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div class="flex justify-between h-16">
                        <div class="flex items-center">
                            <h1 class="text-xl font-semibold">Sistema de Materias</h1>
                        </div>
                        <div class="flex items-center">
                            <span class="mr-4">{{ email }}</span>
                            <button (click)="logout()" 
                                class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div class="px-4 py-6 sm:px-0">
                    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <!-- Materias disponibles -->
                        <div class="bg-white overflow-hidden shadow rounded-lg">
                            <div class="px-4 py-5 sm:p-6">
                                <h2 class="text-lg font-medium text-gray-900 mb-4">Materias Disponibles</h2>
                                <div class="space-y-4">
                                    <div *ngFor="let materia of materiasDisponibles" 
                                        class="border p-4 rounded-md">
                                        <h3 class="font-medium">{{ materia.nombre }}</h3>
                                        <p class="text-sm text-gray-500">{{ materia.descripcion }}</p>
                                        <p class="text-sm text-gray-500">Créditos: {{ materia.creditos }}</p>
                                        <button (click)="registrarMateria(materia.id)"
                                            class="mt-2 bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700">
                                            Registrar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Materias registradas -->
                        <div class="bg-white overflow-hidden shadow rounded-lg">
                            <div class="px-4 py-5 sm:p-6">
                                <h2 class="text-lg font-medium text-gray-900 mb-4">Mis Materias</h2>
                                <div class="space-y-4">
                                    <div *ngFor="let materia of materiasRegistradas" 
                                        class="border p-4 rounded-md">
                                        <h3 class="font-medium">{{ materia.nombre }}</h3>
                                        <p class="text-sm text-gray-500">{{ materia.descripcion }}</p>
                                        <p class="text-sm text-gray-500">Créditos: {{ materia.creditos }}</p>
                                        <button (click)="eliminarRegistro(materia.id)"
                                            class="mt-2 bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700">
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: []
})
export class MateriasComponent implements OnInit {
    materiasDisponibles: Materia[] = [];
    materiasRegistradas: Materia[] = [];
    email: string = '';
    userId: number = 0;

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

    ngOnInit() {
        this.cargarMaterias();
        this.cargarMateriasRegistradas();
    }

    cargarMaterias() {
        this.materiasService.getMaterias().subscribe({
            next: (materias) => {
                this.materiasDisponibles = materias;
            },
            error: (error) => {
                console.error('Error al cargar materias:', error);
            }
        });
    }

    cargarMateriasRegistradas() {
        this.materiasService.getMateriasByEstudiante(this.userId).subscribe({
            next: (materias) => {
                this.materiasRegistradas = materias;
            },
            error: (error) => {
                console.error('Error al cargar materias registradas:', error);
            }
        });
    }

    registrarMateria(materiaId: number) {
        this.materiasService.registrarMateria({
            estudianteId: this.userId,
            materiaId: materiaId
        }).subscribe({
            next: () => {
                this.cargarMaterias();
                this.cargarMateriasRegistradas();
            },
            error: (error) => {
                console.error('Error al registrar materia:', error);
            }
        });
    }

    eliminarRegistro(materiaId: number) {
        this.materiasService.eliminarRegistro(this.userId, materiaId).subscribe({
            next: () => {
                this.cargarMaterias();
                this.cargarMateriasRegistradas();
            },
            error: (error) => {
                console.error('Error al eliminar registro:', error);
            }
        });
    }

    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
} 