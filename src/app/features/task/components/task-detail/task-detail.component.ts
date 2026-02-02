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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskState } from '../../interfaces/task.models';
import { TasksService } from '../../services/task.service';
import { ToastService } from '../../../../shared/components/toast/toast.service';
import { StateBadgeConfig } from '../create-task/create-task.component';

@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, ReactiveFormsModule],
  templateUrl: './task-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetailComponent {
  @Input({ required: true }) open!: boolean;
  @Input() task: Task | null = null;
  @Input() loading = false;

  @Output() closed = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<string>();
  @Output() updated = new EventEmitter<Task>(); // <-- NUEVO

  private fb = inject(FormBuilder);
  private taskService = inject(TasksService);
  private toastService = inject(ToastService);

  private loaded = signal<Set<string>>(new Set());
  private errored = signal<Set<string>>(new Set());

  editing = signal(false);
  saving = signal(false);
  deleting = signal(false);
  apiError = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  stateConfig: Record<TaskState, StateBadgeConfig> = {
    TODO: { label: 'Por hacer', class: 'badge-neutral' },
    PENDING: { label: 'Pendiente', class: 'badge-info' },
    IN_PROGRESS: { label: 'En progreso', class: 'badge-warning' },
    DONE: { label: 'Finalizado', class: 'badge-success' },
  };

  constructor() {
    effect(() => {
      this.resetImageStates();
    });
  }

  close() {
    this.editing.set(false);
    this.closed.emit();
  }

  startEdit() {
    if (!this.task) return;

    this.apiError.set(null);
    this.form.reset({
      title: this.task.title ?? '',
      description: this.task.description ?? '',
    });

    this.editing.set(true);
  }

  cancelEdit() {
    this.apiError.set(null);
    this.editing.set(false);
  }

  save() {
    this.apiError.set(null);
    if (!this.task) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const { title, description } = this.form.getRawValue();

    this.taskService.updateTask(this.task.id, { title, description }).subscribe({
      next: (updatedTask) => {
        this.toastService.success('Tarea actualizada');
        this.updated.emit(updatedTask);
        this.editing.set(false);
        this.saving.set(false);
      },
      error: (err) => {
        console.error(err);
        this.apiError.set('Error al actualizar la tarea.');
        this.toastService.error('Error al actualizar');
        this.saving.set(false);
      },
    });
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
    if (!this.task?.id) return;
    this.deleting.set(true);

    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => {
        this.toastService.success('Tarea eliminada correctamente');
        this.deleted.emit(this.task?.id);
        this.closed.emit();
        this.deleting.set(false);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Error al eliminar la tarea');
        this.deleting.set(false);
      },
    });
  }
}
