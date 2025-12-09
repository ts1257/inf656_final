import { Component, OnInit } from '@angular/core';
import { Course, CourseService } from '../../../services/course.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-course-list',
  standalone: true,
  templateUrl: './course-list.component.html',
  styleUrl: './course-list.component.css',
  imports: [
    ReactiveFormsModule,
    MatSnackBarModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    NgIf,
    NgFor,
    AsyncPipe
  ]
})
export class CourseListComponent implements OnInit {
  courses$!: Observable<Course[]>;
  form: FormGroup;
  editingId: string | null = null;
  loading = false;

  constructor(
    private courseService: CourseService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]],
      instructor: [''],
      semester: ['']
    });
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  loadCourses(): void {
    this.courses$ = this.courseService.getCourses();
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value as Course;
    this.loading = true;

    if (this.editingId) {
      this.courseService.updateCourse(this.editingId, value).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Course updated', 'Close', { duration: 2000 });
          this.resetForm();
          this.loadCourses();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to update course', 'Close', { duration: 3000 });
        }
      });
    } else {
      this.courseService.createCourse(value).subscribe({
        next: () => {
          this.loading = false;
          this.snackBar.open('Course created', 'Close', { duration: 2000 });
          this.resetForm();
          this.loadCourses();
        },
        error: () => {
          this.loading = false;
          this.snackBar.open('Failed to create course', 'Close', { duration: 3000 });
        }
      });
    }
  }

  edit(course: Course): void {
    this.editingId = course._id || null;
    this.form.patchValue({
      name: course.name,
      code: course.code,
      instructor: course.instructor || '',
      semester: course.semester || ''
    });
  }

  cancelEdit(): void {
    this.resetForm();
  }

  resetForm(): void {
    this.editingId = null;
    this.form.reset();
  }

  delete(course: Course): void {
    if (!course._id) return;
    const confirmed = confirm(`Delete course "${course.name}"?`);
    if (!confirmed) return;

    this.courseService.deleteCourse(course._id).subscribe({
      next: () => {
        this.snackBar.open('Course deleted', 'Close', { duration: 2000 });
        this.loadCourses();
      },
      error: () => {
        this.snackBar.open('Failed to delete course', 'Close', { duration: 3000 });
      }
    });
  }
}
