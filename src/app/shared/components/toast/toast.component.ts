import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
    selector: 'app-toast',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="toast toast-bottom toast-end z-50">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="alert" [ngClass]="{
          'alert-success': toast.type === 'success',
          'alert-error': toast.type === 'error',
          'alert-info': toast.type === 'info',
          'alert-warning': toast.type === 'warning'
        }">
          <span>{{ toast.message }}</span>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
    toastService = inject(ToastService);
}
