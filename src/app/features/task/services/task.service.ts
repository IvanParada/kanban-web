import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay, map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  ApiResponse,
  ConfirmPayload,
  CreateTaskPayload,
  GetTasksResponseDto,
  KanbanTaskState,
  PresignPayload,
  PresignResponse,
  Task,
  TaskImage,
} from '../interfaces/task.models';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  //TASKS
  getTasks(): Observable<Task[]> {
    return this.http.get<GetTasksResponseDto>(`${this.baseUrl}/tasks`).pipe(
      delay(500),
      map((resp) => resp.data.map(({ user, ...task }) => task)),
    );
  }

  getTaskById(id: string): Observable<Task> {
    return this.http
      .get<ApiResponse<Task>>(`${this.baseUrl}/tasks/${id}`)
      .pipe(map((resp) => resp.data));
  }

  // updateTask(id: string, payload: Partial<Task>): Observable<Task> {
  //   return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}`, payload);
  // }

  // updateTaskState(id: string, state: string): Observable<Task> {
  //   return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}`, { state });
  // }
  updateTask(id: string, payload: Partial<Task>) {
    return this.http
      .patch<ApiResponse<Task>>(`${this.baseUrl}/tasks/${id}`, payload)
      .pipe(map((resp) => resp.data));
  }

  updateTaskState(id: string, state: KanbanTaskState) {
    return this.http
      .patch<ApiResponse<Task>>(`${this.baseUrl}/tasks/${id}`, { state })
      .pipe(map((resp) => resp.data));
  }

  createTask(task: CreateTaskPayload): Observable<Task> {
    return this.http
      .post<ApiResponse<Task>>(`${this.baseUrl}/tasks`, task)
      .pipe(map((resp) => resp.data));
  }

  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
  }

  //TASK-IMAGES
  refreshSignedUrl(imageId: string): Observable<{ signedUrl: string }> {
    return this.http.get<{ signedUrl: string }>(
      `${this.baseUrl}/task-images/${imageId}/signed-url`,
    );
  }

  uploadImageToSupabase(signedUrl: string, file: File): Observable<void> {
    return this.http.put<void>(signedUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  }

  presignTaskImages(payload: PresignPayload): Observable<PresignResponse[]> {
    return this.http
      .post<ApiResponse<PresignResponse[]>>(`${this.baseUrl}/task-images/presign`, payload)
      .pipe(map((resp) => resp.data));
  }

  confirmTaskImages(payload: ConfirmPayload): Observable<TaskImage[]> {
    return this.http
      .post<ApiResponse<TaskImage[]>>(`${this.baseUrl}/task-images/confirm`, payload)
      .pipe(map((resp) => resp.data));
  }
}
