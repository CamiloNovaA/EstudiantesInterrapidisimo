export interface Materia {
    id: number;
    nombre: string;
    descripcion: string;
    creditos: number;
}

export interface MateriaRegistro {
    estudianteId: number;
    materiaId: number;
} 