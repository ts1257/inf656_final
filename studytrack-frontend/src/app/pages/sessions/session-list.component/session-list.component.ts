import { Component, OnInit } from '@angular/core';
import { SessionService, StudySession } from '../../../services/session.service';
import { Course, CourseService } from '../../../services/course.service';
import { Task, TaskService } from '../../../services/task.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-session-list',
  standalone: true,
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.css',
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
export class SessionListComponent implements OnInit {
  sessions$!: Observable<StudySession[]>;
  courses$!: Observable<Course[]>;
  tasks$!: Observable<Task[]>;
  filteredTasks$!: Observable<Task[]>;

  form: FormGroup;
  editingId: string | null = null;
  loading = false;

  statuses = ['planned', 'completed', 'canceled'];

  constructor(
    private sessionService: SessionService,
    private courseService: CourseService,
    private taskService: TaskService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      course: [''],
      task: [''],
      date: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      durationMinutes: [60, [Validators.required, Validators.min(15)]],
      notes: [''],
      status: ['planned']
    });
  }

  ngOnInit(): void {
    this.loadSessions();
    this.courses$ = this.courseService.getCourses();
    this.tasks$ = this.taskService.getTasks();

    const courseControl = this.form.get('course');
    const taskControl = this.form.get('task');

    if (courseControl && taskControl) {
      this.filteredTasks$ = combineLatest([
        this.tasks$,
        courseControl.valueChanges.pipe(startWith(courseControl.value))
      ]).pipe(
        map(([tasks, courseId]) => {
          if (!courseId) {
            return tasks;
          }
          return tasks.filter(t => this.getTaskCourseId(t) === courseId);
        })
      );

      courseControl.valueChanges.subscribe(() => {
        taskControl.setValue('');
      });
    } else {
      this.filteredTasks$ = this.tasks$;
    }
  }

  loadSessions(): void {
    this.sessions$ = this.sessionService.getSessions();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as StudySession;
    this.loading = true;

    if (this.editingId) {
      this.sessionService.updateSession(this.editingId, value).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Study session updated', 'Close', { duration: 2000 });
          this.resetForm();
          this.loadSessions();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to update session', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.sessionService.createSession(value).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Study session created', 'Close', { duration: 2000 });
          this.resetForm();
          this.loadSessions();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to create session', 'Close', { duration: 3000 });
        }
      });
    }
  }

  edit(session: StudySession): void {
    this.editingId = session._id || null;
    const courseId = this.getSessionCourseId(session);
    const taskId = this.getSessionTaskId(session);

    this.form.patchValue({
      course: courseId,
      task: taskId,
      date: session.date.substring(0, 10),
      startTime: session.startTime,
      durationMinutes: session.durationMinutes,
      notes: session.notes || '',
      status: session.status || 'planned'
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset({
      course: '',
      task: '',
      date: '',
      startTime: '',
      durationMinutes: 60,
      notes: '',
      status: 'planned'
    });
  }

  delete(session: StudySession): void {
    if (!session._id) return;
    const confirmed = confirm('Delete this study session?');
    if (!confirmed) return;

    this.sessionService.deleteSession(session._id).subscribe({
      next: () => {
        this.snackBar.open('Study session deleted', 'Close', { duration: 2000 });
        this.loadSessions();
      },
      error: () => {
        this.snackBar.open('Failed to delete session', 'Close', { duration: 3000 });
      }
    });
  }

  private getTaskCourseId(task: Task): string | null {
    const c: any = task.course;
    if (!c) return null;
    if (typeof c === 'string') return c;
    if (typeof c === 'object' && c._id) return c._id;
    return null;
  }

  private getSessionCourseId(session: StudySession): string {
    const c: any = session.course;
    if (!c) return '';
    if (typeof c === 'string') return c;
    if (typeof c === 'object' && c._id) return c._id;
    return '';
  }

  private getSessionTaskId(session: StudySession): string {
    const t: any = session.task;
    if (!t) return '';
    if (typeof t === 'string') return t;
    if (typeof t === 'object' && t._id) return t._id;
    return '';
  }

  getSessionCourseLabel(session: StudySession): string {
    const c: any = session.course;
    if (!c) return '-';
    if (typeof c === 'string') return c;
    if (c.name && c.code) return `${c.name} (${c.code})`;
    if (c.name) return c.name;
    if (c.code) return c.code;
    if (c._id) return c._id;
    return '-';
  }

  getSessionTaskLabel(session: StudySession): string {
    const t: any = session.task;
    if (!t) return '-';
    if (typeof t === 'string') return t;
    if (t.title) return t.title;
    if (t._id) return t._id;
    return '-';
  }
}
