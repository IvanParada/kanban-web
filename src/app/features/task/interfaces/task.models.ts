export interface ApiResponse<T> {
    status: 'success' | 'error';
    data: T;
}

export type TaskState = 'TODO' | 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface User {
    id: string;
    email: string;
}

export interface TaskImage {
    id: string;
    url: string;
    key: string;
    mimeType: string;
    originalName: string;
    signedUrl?: string;
}

export interface Task {
    id: string;
    title: string;
    description: string;
    state: TaskState;
    createdAt: string;
    updatedAt: string;
    user?: User;
    images?: TaskImage[];
}

export type TaskDto = Task;

export type GetTasksResponseDto = ApiResponse<TaskDto[]>;

export type CreateTaskPayload = Pick<Task, 'title' | 'description' | 'state'>;

export interface PresignFileRequest {
    filename: string;
    mimeType: string;
}

export interface PresignPayload {
    taskId: string;
    files: PresignFileRequest[];
}

export interface PresignResponse {
    signedUrl: string;
    path: string;
    token: string;
    originalName: string;
}

export interface ConfirmImagePayload {
    key: string;
    url: string;
    mimeType: string;
    size: number;
    originalName: string;
}

export interface ConfirmPayload {
    taskId: string;
    images: ConfirmImagePayload[];
}
