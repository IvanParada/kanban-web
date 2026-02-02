import { Injectable, signal } from '@angular/core';

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    toasts = signal<Toast[]>([]);
    private counter = 0;

    show(message: string, type: Toast['type'] = 'info') {
        const id = this.counter++;
        this.toasts.update(toasts => [...toasts, { id, message, type }]);

        // Auto remove after 3s
        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    success(message: string) {
        this.show(message, 'success');
    }

    error(message: string) {
        this.show(message, 'error');
    }

    info(message: string) {
        this.show(message, 'info');
    }

    warning(message: string) {
        this.show(message, 'warning');
    }

    remove(id: number) {
        this.toasts.update(toasts => toasts.filter(t => t.id !== id));
    }
}
