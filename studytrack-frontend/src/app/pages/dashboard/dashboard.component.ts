import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Course, CourseService } from '../../services/course.service';
import { Task, TaskService } from '../../services/task.service';
import { SessionService, StudySession } from '../../services/session.service';
import { combineLatest, map, Observable } from 'rxjs';

interface CourseStatus {
  semester: string;
  count: number;
}

interface DashboardStats {
  totalCourses: number;
  courseStatuses: CourseStatus[];

  totalTasks: number;
  notStarted: number;
  inProgress: number;
  done: number;

  totalSessions: number;
  plannedSessions: number;
  completedSessions: number;
  canceledSessions: number;

  tasksDueToday: number;
  sessionsToday: number;
  minutesToday: number;
}

interface UpcomingTaskView extends Task {
  courseLabel: string;
}

interface UpcomingSessionView extends StudySession {
  courseLabel: string;
}

interface TodayTaskView extends Task {
  courseLabel: string;
}

interface TodaySessionView extends StudySession {
  courseLabel: string;
}

interface DashboardViewModel {
  stats: DashboardStats;
  upcomingTasks: UpcomingTaskView[];
  upcomingSessions: UpcomingSessionView[];
  todayTasks: TodayTaskView[];
  todaySessions: TodaySessionView[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [MatCardModule, MatButtonModule, NgIf, NgFor, AsyncPipe, DatePipe, RouterLink]
})
export class DashboardComponent {
  vm$: Observable<DashboardViewModel>;

  constructor(
    private courseService: CourseService,
    private taskService: TaskService,
    private sessionService: SessionService
  ) {
    this.vm$ = combineLatest([
      this.courseService.getCourses(),
      this.taskService.getTasks(),
      this.sessionService.getSessions()
    ]).pipe(
      map(([courses, tasks, sessions]) => {
        const stats = this.buildStats(courses, tasks, sessions);
        const { upcomingTasks, upcomingSessions } = this.buildUpcoming(courses, tasks, sessions);
        const { todayTasks, todaySessions } = this.buildToday(courses, tasks, sessions);
        return { stats, upcomingTasks, upcomingSessions, todayTasks, todaySessions };
      })
    );
  }

  private buildStats(
    courses: Course[],
    tasks: Task[],
    sessions: StudySession[]
  ): DashboardStats {
    const totalCourses = courses.length;

    const semesterCounts: Record<string, number> = {};
    courses.forEach(c => {
      if (!c.semester) return;
      semesterCounts[c.semester] = (semesterCounts[c.semester] || 0) + 1;
    });
    const courseStatuses: CourseStatus[] = Object.keys(semesterCounts).map(sem => ({
      semester: sem,
      count: semesterCounts[sem]
    }));

    const totalTasks = tasks.length;
    const notStarted = tasks.filter(t => t.status === 'not-started').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const done = tasks.filter(t => t.status === 'done').length;

    const totalSessions = sessions.length;
    const plannedSessions = sessions.filter(s => s.status === 'planned').length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const canceledSessions = sessions.filter(s => s.status === 'canceled').length;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const tasksDueToday = tasks.filter(t => {
      const d = new Date(t.dueDate);
      return d >= todayStart && d <= todayEnd;
    }).length;

    const sessionsTodayList = sessions.filter(s => {
      const d = new Date(s.date);
      return d >= todayStart && d <= todayEnd;
    });

    const sessionsToday = sessionsTodayList.length;
    const minutesToday = sessionsTodayList.reduce(
      (sum, s) => sum + (s.durationMinutes || 0),
      0
    );

    return {
      totalCourses,
      courseStatuses,
      totalTasks,
      notStarted,
      inProgress,
      done,
      totalSessions,
      plannedSessions,
      completedSessions,
      canceledSessions,
      tasksDueToday,
      sessionsToday,
      minutesToday
    };
  }

  private buildUpcoming(
    courses: Course[],
    tasks: Task[],
    sessions: StudySession[]
  ): { upcomingTasks: UpcomingTaskView[]; upcomingSessions: UpcomingSessionView[] } {
    const today = new Date();
    const end = new Date();
    end.setDate(today.getDate() + 7);

    const byCourseId = new Map<string, Course>();
    courses.forEach(c => {
      if (c._id) byCourseId.set(c._id, c);
    });

    const upcomingTasksRaw = tasks.filter(t => {
      const due = new Date(t.dueDate);
      return due >= today && due <= end;
    });

    upcomingTasksRaw.sort((a, b) => {
      const da = new Date(a.dueDate).getTime();
      const db = new Date(b.dueDate).getTime();
      return da - db;
    });

    const upcomingTasks: UpcomingTaskView[] = upcomingTasksRaw.slice(0, 5).map(t => {
      const c: any = t.course;
      let courseId: string | null = null;
      if (c) {
        if (typeof c === 'string') courseId = c;
        else if (c._id) courseId = c._id;
      }
      const course = courseId ? byCourseId.get(courseId) : undefined;
      const courseLabel = course
        ? `${course.name} (${course.code})`
        : courseId || '';
      return {
        ...t,
        courseLabel: courseLabel || '-'
      };
    });

    const upcomingSessionsRaw = sessions.filter(s => {
      const d = new Date(s.date);
      return d >= today && d <= end;
    });

    upcomingSessionsRaw.sort((a, b) => {
      const da = new Date(a.date).getTime();
      const db = new Date(b.date).getTime();
      return da - db;
    });

    const upcomingSessions: UpcomingSessionView[] = upcomingSessionsRaw.slice(0, 5).map(s => {
      const c: any = s.course;
      let courseId: string | null = null;
      if (c) {
        if (typeof c === 'string') courseId = c;
        else if (c._id) courseId = c._id;
      }
      const course = courseId ? byCourseId.get(courseId) : undefined;
      const courseLabel = course
        ? `${course.name} (${course.code})`
        : courseId || '';
      return {
        ...s,
        courseLabel: courseLabel || '-'
      };
    });

    return { upcomingTasks, upcomingSessions };
  }

  private buildToday(
    courses: Course[],
    tasks: Task[],
    sessions: StudySession[]
  ): { todayTasks: TodayTaskView[]; todaySessions: TodaySessionView[] } {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const byCourseId = new Map<string, Course>();
    courses.forEach(c => {
      if (c._id) byCourseId.set(c._id, c);
    });

    const todayTasksRaw = tasks.filter(t => {
      const d = new Date(t.dueDate);
      return d >= todayStart && d <= todayEnd;
    });

    const todayTasks: TodayTaskView[] = todayTasksRaw.map(t => {
      const c: any = t.course;
      let courseId: string | null = null;
      if (c) {
        if (typeof c === 'string') courseId = c;
        else if (c._id) courseId = c._id;
      }
      const course = courseId ? byCourseId.get(courseId) : undefined;
      const courseLabel = course
        ? `${course.name} (${course.code})`
        : courseId || '';
      return {
        ...t,
        courseLabel: courseLabel || '-'
      };
    });

    const todaySessionsRaw = sessions.filter(s => {
      const d = new Date(s.date);
      return d >= todayStart && d <= todayEnd;
    });

    const todaySessions: TodaySessionView[] = todaySessionsRaw.map(s => {
      const c: any = s.course;
      let courseId: string | null = null;
      if (c) {
        if (typeof c === 'string') courseId = c;
        else if (c._id) courseId = c._id;
      }
      const course = courseId ? byCourseId.get(courseId) : undefined;
      const courseLabel = course
        ? `${course.name} (${course.code})`
        : courseId || '';
      return {
        ...s,
        courseLabel: courseLabel || '-'
      };
    });

    return { todayTasks, todaySessions };
  }
}
