import { Component, OnInit } from '@angular/core';
import { Task, TaskService } from '../../../services/task.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-task-list',
  standalone: true,
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    NgIf,
    NgFor,
    AsyncPipe,
    DatePipe
  ]
})
export class TaskListComponent implements OnInit {
  tasks$!: Observable<Task[]>;
  form: FormGroup;
  editingId: string | null = null;
  loading = false;

  taskTypes = ['assignment', 'exam', 'project', 'quiz'];
  priorities = ['low', 'medium', 'high'];
  statuses = ['not-started', 'in-progress', 'done'];

  constructor(
    private taskService: TaskService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      course: ['', [Validators.required]],
      title: ['', [Validators.required]],
      type: ['', [Validators.required]],
      dueDate: ['', [Validators.required]],
      estimatedTimeHours: [''],
      priority: ['medium'],
      status: ['not-started']
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.tasks$ = this.taskService.getTasks();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as unknown as Task;
    this.loading = true;

    if (this.editingId) {
      this.taskService.updateTask(this.editingId, value).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Task updated', 'Close', { duration: 2000 });
          this.resetForm();
          this.loadTasks();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to update task', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.taskService.createTask(value).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Task created', 'Close', { duration: 2000 });
          this.resetForm();
          this.loadTasks();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to create task', 'Close', { duration: 3000 });
        }
      });
    }
  }

  edit(task: Task): void {
    this.editingId = task._id || null;

    const courseId =
      typeof task.course === 'string'
        ? task.course
        : task.course && typeof task.course === 'object'
        ? task.course._id
        : '';

    this.form.patchValue({
      course: courseId,
      title: task.title,
      type: task.type,
      dueDate: task.dueDate.substring(0, 10),
      estimatedTimeHours: task.estimatedTimeHours || '',
      priority: task.priority || 'medium',
      status: task.status || 'not-started'
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      course: '',
      title: '',
      type: '',
      dueDate: '',
      estimatedTimeHours: '',
      priority: 'medium',
      status: 'not-started'
    });
  }

  delete(task: Task): void {
    if (!task._id) return;
    const confirmed = confirm(`Delete task "${task.title}"?`);
    if (!confirmed) return;

    this.taskService.deleteTask(task._id).subscribe({
      next: () => {
        this.snackBar.open('Task deleted', 'Close', { duration: 2000 });
        this.loadTasks();
      },
      error: () => {
        this.snackBar.open('Failed to delete task', 'Close', { duration: 3000 });
      }
    });
  }

  getCourseLabel(task: Task): string {
    const c: any = task.course;
    if (!c) return '-';
    if (typeof c === 'string') return c;
    if (c.name && c.code) return `${c.name} (${c.code})`;
    if (c.name) return c.name;
    if (c.code) return c.code;
    if (c._id) return c._id;
    return '-';
  }
}
