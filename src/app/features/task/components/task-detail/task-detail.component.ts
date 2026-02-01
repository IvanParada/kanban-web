import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
  effect
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Task } from '../../interfaces/task.models';

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

  private loaded = signal<Set<string>>(new Set());
  private errored = signal<Set<string>>(new Set());

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
}
