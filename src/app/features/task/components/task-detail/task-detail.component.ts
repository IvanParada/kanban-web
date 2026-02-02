import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  effect,
  inject,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task, TaskState } from '../../interfaces/task.models';
import { TasksService } from '../../services/task.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { StateBadgeConfig } from '../create-task/create-task.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './task-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailComponent {
  @Input({ required: true }) open!: boolean;
  @Input() task: Task | null = null;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<string>();

  private loaded = signal<Set<string>>(new Set());
  private errored = signal<Set<string>>(new Set());
  private TaskService = inject(TasksService);
  private toastService = inject(ToastService);

  stateConfig: Record<TaskState, StateBadgeConfig> = {
    TODO: {
      label: 'Por hacer',
      class: 'badge-neutral',
    },
    PENDING: {
      label: 'Pendiente',
      class: 'badge-info',
    },
    IN_PROGRESS: {
      label: 'En progreso',
      class: 'badge-warning',
    },
    DONE: {
      label: 'Finalizado',
      class: 'badge-success',
    },
  };

  constructor() {
    effect(() => {
      const id = this.task?.id;
      this.resetImageStates();
    });
  }

  close() {
    this.closed.emit();
  }

  resetImageStates() {
    this.loaded.set(new Set());
    this.errored.set(new Set());
  }

  onImgLoad(id: string) {
    const s = new Set(this.loaded());
    s.add(id);
    this.loaded.set(s);

    const e = new Set(this.errored());
    e.delete(id);
    this.errored.set(e);
  }

  onImgError(id: string) {
    const e = new Set(this.errored());
    e.add(id);
    this.errored.set(e);

    const s = new Set(this.loaded());
    s.delete(id);
    this.loaded.set(s);
  }

  isImgLoaded(id: string) {
    return this.loaded().has(id);
  }

  isImgErrored(id: string) {
    return this.errored().has(id);
  }

  deleteTask() {
    this.TaskService.deleteTask(this.task?.id!).subscribe({
      next: () => {
        this.toastService.success('Tarea eliminada correctamente');
        this.deleted.emit(this.task?.id!);
        this.closed.emit();
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Error al eliminar la tarea');
      },
    });
  }
}
