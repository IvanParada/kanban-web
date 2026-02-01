import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, Input, Output, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TasksService } from '../../services/task.service';
import { Task } from '../../interfaces/task.models';

@Component({
  selector: 'app-card',
  imports: [DatePipe],
  templateUrl: './card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {
  private taskService = inject(TasksService);
  private destroyRef = inject(DestroyRef);

  @Input() taskId!: string;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() createdAt: string = '';

  @Output() taskSelected = new EventEmitter<Task>();

  ViewTask() {
    this.taskService.getTaskById(this.taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task) => this.taskSelected.emit(task),
        error: (err) => console.log(err),
      });
  }

}
