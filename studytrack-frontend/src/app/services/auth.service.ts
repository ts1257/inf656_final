import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { API_URL } from '../config';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    const token = this.getToken();
    if (token) {
      this.fetchCurrentUser().subscribe();
    }
  }

  register(data: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/register`, data).pipe(
      tap(res => {
        this.setToken(res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  login(data: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/auth/login`, data).pipe(
      tap(res => {
        this.setToken(res.token);
        this.currentUserSubject.next(res.user);
      })
    );
  }

  fetchCurrentUser(): Observable<{ user: User }> {
    return this.http.get<{ user: User }>(`${API_URL}/auth/me`).pipe(
      tap(res => {
        this.currentUserSubject.next(res.user);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('studytrack_token');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('studytrack_token');
  }

  private setToken(token: string): void {
    localStorage.setItem('studytrack_token', token);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
