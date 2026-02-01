import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ThemeDropdown } from "./theme-dropdown/theme-dropdown";

@Component({
  selector: 'app-navbar',
  imports: [ThemeDropdown],
  templateUrl: './navbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  constructor(
  ) {

  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
