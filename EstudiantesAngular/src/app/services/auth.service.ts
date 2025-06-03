import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginRequest, RegisterRequest, AuthResponse } from '../interfaces/auth.interface';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = 'http://estudiantesinter.somee.com/api';
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient) {}

    login(credentials: LoginRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/login`, credentials)
            .pipe(
                tap(response => {
                    localStorage.setItem('token', response.token);
                    localStorage.setItem('email', JSON.stringify(response.email));
                    localStorage.setItem('idUser', JSON.stringify(response.idUser));
                    this.isAuthenticatedSubject.next(true);
                })
            );
    }

    register(userData: RegisterRequest): Observable<AuthResponse> {
        return this.http.post<AuthResponse>(`${this.apiUrl}/Auth/register`, userData);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isAuthenticatedSubject.next(false);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    private hasToken(): boolean {
        return !!this.getToken();
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('email');
        return userStr ? userStr : null;
    }

    getCurrentId() {
        const userStr = localStorage.getItem('idUser');
        return userStr ? parseInt(userStr) : 0;
    }
} 