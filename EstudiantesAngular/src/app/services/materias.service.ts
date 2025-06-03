import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Materia, MateriaRegistro } from '../interfaces/materia.interface';

@Injectable({
    providedIn: 'root'
})
export class MateriasService {
    private apiUrl = 'http://estudiantesinter.somee.com/api';

    constructor(private http: HttpClient) {}

    getMaterias(): Observable<Materia[]> {
        return this.http.get<Materia[]>(`${this.apiUrl}/Materias`);
    }

    getMateriasByEstudiante(estudianteId: number): Observable<Materia[]> {
        return this.http.get<Materia[]>(`${this.apiUrl}/Materias/estudiante/${estudianteId}`);
    }

    registrarMateria(registro: MateriaRegistro): Observable<any> {
        return this.http.post(`${this.apiUrl}/Materias/registrar`, registro);
    }

    eliminarRegistro(estudianteId: number, materiaId: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/Materias/eliminar/${estudianteId}/${materiaId}`);
    }
} 