import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from '../config';
import { Observable } from 'rxjs';

export interface Task {
  _id?: string;
  course: string;
  title: string;
  type: 'assignment' | 'exam' | 'project' | 'quiz';
  dueDate: string;
  estimatedTimeHours?: number;
  priority?: 'low' | 'medium' | 'high';
  status?: 'not-started' | 'in-progress' | 'done';
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private baseUrl = `${API_URL}/tasks`;

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }

  getTask(id: string): Observable<Task> {
    return this.http.get<Task>(`${this.baseUrl}/${id}`);
  }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }

  updateTask(id: string, task: Partial<Task>): Observable<Task> {
    return this.http.put<Task>(`${this.baseUrl}/${id}`, task);
  }

  deleteTask(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`);
  }
}
