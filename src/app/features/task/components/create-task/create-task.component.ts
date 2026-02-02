import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { FormBuilder, Validators } from "@angular/forms";
import { signal } from "@angular/core";
import { TasksService } from "../../services/task.service";
import { ToastService } from "../../../../shared/components/toast/toast.service";
import { TaskState, Task, ConfirmImagePayload } from "../../interfaces/task.models";
import { NgClass } from "@angular/common";
import { forkJoin, switchMap, EMPTY, finalize, map, of } from "rxjs";

type StateBadgeConfig = {
  label: string;
  class: string;
};

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './create-task.component.html',
})
export class CreateTaskComponent {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TasksService);
  private readonly toastService = inject(ToastService);

  @Input({ required: true }) state!: TaskState;
  @Output() taskCreated = new EventEmitter<Task>();

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
      label: 'Hecho',
      class: 'badge-success',
    },
  };


  open = signal(false);
  apiError = signal<string | null>(null);
  saving = signal(false);
  selectedFiles = signal<File[]>([]);

  form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
  });

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFiles.set(Array.from(input.files));
    }
  }

  submit() {
    this.apiError.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);

    const { title, description } = this.form.getRawValue();
    const files = this.selectedFiles();

    this.taskService.createTask({
      title,
      description,
      state: this.state,
    }).pipe(
      switchMap((task) => {

        if (files.length === 0) {
          return of(task);
        }

        const presignPayload = {
          taskId: task.id,
          files: files.map(f => ({ filename: f.name, mimeType: f.type }))
        };

        return this.taskService.presignTaskImages(presignPayload).pipe(
          switchMap((presignResponses) => {
            const uploads$ = presignResponses.map((res, index) => {
              const matchingFile = files.find(f => f.name === res.originalName) || files[index];

              return this.taskService.uploadImageToSupabase(res.signedUrl, matchingFile).pipe(
                map(() => ({
                  key: res.path,
                  url: res.signedUrl.split('?')[0],
                  mimeType: matchingFile.type,
                  size: matchingFile.size,
                  originalName: matchingFile.name
                } as ConfirmImagePayload))
              );
            });

            return forkJoin(uploads$).pipe(
              switchMap((uploadedImages: ConfirmImagePayload[]) => {
                return this.taskService.confirmTaskImages({
                  taskId: task.id,
                  images: uploadedImages
                }).pipe(
                  map((confirmedImages) => {
                    task.images = confirmedImages;
                    return task;
                  })
                );
              })
            );
          })
        );
      }),
      finalize(() => this.saving.set(false))
    ).subscribe({
      next: (task) => {
        this.taskCreated.emit(task);
        this.form.reset({ title: '', description: '' });
        this.selectedFiles.set([]);
        this.open.set(false);
        this.toastService.success('Tarea creada correctamente');
      },
      error: (err) => {
        console.error(err);
        this.apiError.set('Error al crear la tarea o subir archivos.');
        this.toastService.error('Error al crear la tarea');
      }
    });
  }
}
