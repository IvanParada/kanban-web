import { Component, OnInit, inject, DestroyRef, signal } from '@angular/core';
import { finalize, timeout } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TasksService } from './services/task.service';
import { Task, KanbanTaskState } from './interfaces/task.models';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ColumnsComponent } from './components/columns/columns.component';
import { SkeletonComponent } from './components/skeleton/skeleton.component';
import { TaskDetailComponent } from './components/task-detail/task-detail.component';

export type TaskColumns = Record<KanbanTaskState, Task[]>;

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [DragDropModule, ColumnsComponent, SkeletonComponent, TaskDetailComponent],
  templateUrl: './task.component.html',
})
export default class TaskComponent implements OnInit {
  private taskService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  readonly columnOrder: KanbanTaskState[] = ['TODO', 'PENDING', 'IN_PROGRESS', 'DONE'];

  tasks = signal<Task[]>([]);
  loading = signal(false);
  errorMsg = signal<string | null>(null);
  columns = signal<TaskColumns>({ TODO: [], PENDING: [], IN_PROGRESS: [], DONE: [] });

  readonly drawerOpen = signal(false);
  readonly selectedTask = signal<Task | null>(null);

  ngOnInit(): void {
    this.getTasks();
  }

  private buildColumns(tasks: Task[]): void {
    const cols: TaskColumns = { TODO: [], PENDING: [], IN_PROGRESS: [], DONE: [] };

    for (const t of tasks) {
      const key = this.isTaskState(t.state) ? t.state : 'PENDING';
      cols[key].push(t);
    }

    this.columns.set(cols);
  }

  private isTaskState(v: any): v is KanbanTaskState {
    return v === 'TODO' || v === 'PENDING' || v === 'IN_PROGRESS' || v === 'DONE';
  }

  getTasks(): void {
    this.loading.set(true);
    this.errorMsg.set(null);

    this.taskService
      .getTasks()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading.set(false);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (tasks) => {
          this.tasks.set(tasks);
          this.buildColumns(tasks);
        },
        error: (err) => {
          this.errorMsg.set(
            err?.name === 'TimeoutError'
              ? 'La API no respondió (timeout)'
              : (err?.error?.message ?? 'Error obteniendo tareas'),
          );
        },
      });
  }

  drop(event: CdkDragDrop<Task[]>, targetState: KanbanTaskState) {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(currList, event.previousIndex, event.currentIndex);
      return;
    }

    const movedTask = prevList[event.previousIndex];
    const prevState = movedTask.state;

    transferArrayItem(prevList, currList, event.previousIndex, event.currentIndex);
    movedTask.state = targetState;

    this.tasks.update((arr) => arr.map((t) => (t.id === movedTask.id ? movedTask : t)));

    this.taskService
      .updateTaskState(movedTask.id, targetState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          const currentIndex = currList.findIndex((t) => t.id === movedTask.id);
          if (currentIndex >= 0) {
            transferArrayItem(currList, prevList, currentIndex, event.previousIndex);
          }
          movedTask.state = prevState;
          this.tasks.update((arr) =>
            arr.map((t) => (t.id === movedTask.id ? { ...t, state: prevState } : t)),
          );
          this.buildColumns(this.tasks());
        },
      });
  }

  onTaskSelected(task: Task) {
    this.selectedTask.set(task);
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerOpen.set(false);
  }

  onTaskCreated(task: Task) {
    this.tasks.set([task, ...this.tasks()]);
    this.buildColumns(this.tasks());
    this.closeDrawer();
  }

  onTaskDeleted(taskId: string) {
    this.tasks.set(this.tasks().filter((t) => t.id !== taskId));
    this.buildColumns(this.tasks());
    this.closeDrawer();
  }

  onTaskUpdated(task: Task) {
    console.log('payload updated:', task);
    console.log('task.id:', (task as any)?.id, 'task.data?.id:', (task as any)?.data?.id);
    this.selectedTask.set(task);
    this.tasks.set(this.tasks().map((x) => (x.id === task.id ? task : x)));
    this.buildColumns(this.tasks());
    this.closeDrawer();
  }
}
