import { Component, OnInit, inject, DestroyRef, ChangeDetectorRef, signal } from '@angular/core';
import { finalize, timeout } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TasksService } from './services/task.service';
import { Task, TaskState } from './interfaces/task.models';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ColumnsComponent } from "./components/columns/columns.component";
import { SkeletonComponent } from "./components/skeleton/skeleton.component";
import { TaskDetailComponent } from "./components/task-detail/task-detail.component";

export type TaskColumns = Record<TaskState, Task[]>;

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [DragDropModule, ColumnsComponent, SkeletonComponent, TaskDetailComponent],
  templateUrl: './task.component.html',
})
export default class TaskComponent implements OnInit {
  private taskService = inject(TasksService);
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);
  readonly columnOrder: TaskState[] = ['TODO', 'PENDING', 'IN_PROGRESS', 'DONE'];

  tasks: Task[] = [];
  loading = false;
  errorMsg: string | null = null;
  columns: TaskColumns = { TODO: [], PENDING: [], IN_PROGRESS: [], DONE: [] };


  ngOnInit(): void {
    this.getTasks();
  }

  private buildColumns(tasks: Task[]): void {
    this.columns = { TODO: [], PENDING: [], IN_PROGRESS: [], DONE: [] };

    for (const t of tasks) {
      const key = t.state as TaskState;
      if (this.columns[key]) this.columns[key].push(t);
      else this.columns.PENDING.push(t);
    }
  }

  getTasks(): void {
    this.loading = true;
    this.errorMsg = null;
    this.cdr.markForCheck();

    this.taskService
      .getTasks()
      .pipe(
        timeout(10000),
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.buildColumns(tasks);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMsg =
            err?.name === 'TimeoutError'
              ? 'La API no respondió (timeout)'
              : (err?.error?.message ?? 'Error obteniendo tareas');
          this.cdr.markForCheck();
        },
      });
  }

  drop(event: CdkDragDrop<Task[]>, targetState: TaskState) {
    const prevList = event.previousContainer.data;
    const currList = event.container.data;

    if (event.previousContainer === event.container) {
      moveItemInArray(currList, event.previousIndex, event.currentIndex);
      this.cdr.markForCheck();
      return;
    }

    const movedTask = prevList[event.previousIndex];
    const prevState = movedTask.state;

    transferArrayItem(prevList, currList, event.previousIndex, event.currentIndex);
    movedTask.state = targetState;

    const idx = this.tasks.findIndex(t => t.id === movedTask.id);
    if (idx >= 0) this.tasks[idx] = movedTask;

    this.cdr.markForCheck();

    this.taskService.updateTaskState(movedTask.id, targetState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          const currentIndex = currList.findIndex(t => t.id === movedTask.id);
          if (currentIndex >= 0) {
            transferArrayItem(currList, prevList, currentIndex, event.previousIndex);
          }
          movedTask.state = prevState;
          this.errorMsg = 'No se pudo mover la tarea';
          this.cdr.markForCheck();
        }
      });
  }


  readonly drawerOpen = signal(false);
  readonly selectedTask = signal<Task | null>(null);

  onTaskSelected(task: Task) {
    this.selectedTask.set(task);
    this.drawerOpen.set(true);
  }

  closeDrawer() {
    this.drawerOpen.set(false);
  }


}
