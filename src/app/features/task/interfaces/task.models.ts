export interface ApiResponse<T> {
    status: 'success' | 'error';
    data: T;
}

export type TaskState = 'TODO' | 'PENDING' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id: string;
    title: string;
    description: string;
    state: TaskState;
    createdAt: string;
    updatedAt: string;
}

export type TaskDto = Task & { user: unknown };

export type GetTasksResponseDto = ApiResponse<TaskDto[]>;
