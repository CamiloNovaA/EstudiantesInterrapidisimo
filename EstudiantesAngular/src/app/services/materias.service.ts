import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Materia, MateriaRegistro } from '../interfaces/materia.interface';

@Injectable({
    providedIn: 'root'
})
export class MateriasService {
    private apiUrl = 'http://estudiantesinter.somee.com/api';

    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse) {
        console.error('Error en la petición:', error.error);
        let errorMessage = 'Ha ocurrido un error en el servidor';
        
        if (error.error instanceof ErrorEvent) {
            // Error del cliente
            errorMessage = error.error.error;
        } else {
            // Error del servidor
            if (error.status === 0) {
                errorMessage = 'No se pudo conectar con el servidor';
            } else {
                errorMessage = error.error?.error || error.error || errorMessage;
            }
        }
        
        return throwError(() => new Error(errorMessage));
    }

    getMaterias(estudianteId: number): Observable<Materia[]> {
        return this.http.get<Materia[]>(`${this.apiUrl}/Students/SubjectsAvailable/${estudianteId}`)
            .pipe(
                map(response => {
                    console.log('Respuesta getMaterias:', response);
                    return response;
                }),
                catchError(this.handleError)
            );
    }

    getMateriasByEstudiante(estudianteId: number): Observable<Materia[]> {
        return this.http.get<Materia[]>(`${this.apiUrl}/Students/MySubjects/${estudianteId}`)
            .pipe(
                map(response => {
                    console.log('Respuesta getMateriasByEstudiante:', response);
                    return response;
                }),
                catchError(this.handleError)
            );
    }

    registrarMateria(registro: MateriaRegistro): Observable<any> {
        console.log('Enviando registro:', registro);
        return this.http.post<string>(`${this.apiUrl}/Students/EnrollInSubject`, registro)
            .pipe(
                map(response => {
                    console.log('Respuesta registrarMateria:', response);
                    return response;
                }),
                catchError(error => {
                    console.error('Error en registrarMateria:', error.error);
                    // Si el error es 409 (Conflict) o tiene un mensaje específico, podría ser un caso válido
                    if (error.status === 409 || error.status === 400) {
                        return throwError(() => new Error(error?.error.mensaje || 'Valide si se registro con éxito'));
                    }
                    
                    return this.handleError(error);
                })
            );
    }

    eliminarRegistro(estudianteId: number, materiaId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/Students/${estudianteId}/subjects/${materiaId}`)
            .pipe(
                map(response => {
                    console.log('Respuesta eliminarRegistro:', response);
                    return response;
                }),
                catchError(error => {
                    console.error('Error en eliminarRegistro:', error.error);
                    // Si el error es 409 (Conflict) o tiene un mensaje específico, podría ser un caso válido
                    if (error.status === 409 || error.status === 400) {
                        return throwError(() => new Error(error?.error || 'Valide si se elimino con éxito'));
                    }
                    
                    return this.handleError(error);
                })
            );
    }
} 