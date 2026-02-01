import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { GetTasksResponseDto, Task } from '../interfaces/task.models';

@Injectable({ providedIn: 'root' })
export class TasksService {
    private http = inject(HttpClient);
    private baseUrl = environment.apiUrl;

    getTasks(): Observable<Task[]> {
        return this.http.get<GetTasksResponseDto>(`${this.baseUrl}/tasks`).pipe(
            map(resp => resp.data.map(({ user, ...task }) => task))
        );
    }

    getTaskById(id: string): Observable<Task> {
        return this.http.get<Task>(`${this.baseUrl}/tasks/${id}`);
    }

    updateTask(id: string, task: Task): Observable<Task> {
        return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}`, task);
    }

    updateTaskState(id: string, state: string): Observable<Task> {
        return this.http.patch<Task>(`${this.baseUrl}/tasks/${id}`, { state });
    }

    createTask(task: Task): Observable<Task> {
        return this.http.post<Task>(`${this.baseUrl}/tasks`, task);
    }

    deleteTask(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/tasks/${id}`);
    }


}
