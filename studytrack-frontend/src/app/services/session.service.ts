import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';
import { Observable } from 'rxjs';

export type SessionCourseField =
  | string
  | {
      _id: string;
      name?: string;
      code?: string;
    };

export type SessionTaskField =
  | string
  | {
      _id: string;
      title?: string;
    };

export interface StudySession {
  _id?: string;
  course?: SessionCourseField;
  task?: SessionTaskField;
  date: string;
  startTime: string;
  durationMinutes: number;
  notes?: string;
  status?: 'planned' | 'completed' | 'canceled';
}

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private baseUrl = `${API_URL}/sessions`;

  constructor(private http: HttpClient) {}

  getSessions(): Observable<StudySession[]> {
    return this.http.get<StudySession[]>(this.baseUrl);
  }

  getSession(id: string): Observable<StudySession> {
    return this.http.get<StudySession>(`${this.baseUrl}/${id}`);
  }

  createSession(session: StudySession): Observable<StudySession> {
    return this.http.post<StudySession>(this.baseUrl, session);
  }

  updateSession(id: string, session: Partial<StudySession>): Observable<StudySession> {
    return this.http.put<StudySession>(`${this.baseUrl}/${id}`, session);
  }

  deleteSession(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
