import { Component } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { GlobalSpinnerComponent } from './shared/components/global-spinner/global-spinner.component';
import { AuthService } from './core/services/auth.service';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, SidebarComponent, GlobalSpinnerComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App {

  currentUrl = '';

  constructor(private router: Router, public authService: AuthService) {
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(e => this.currentUrl = (e as NavigationEnd).urlAfterRedirects);
  }

  get isLoginPage(): boolean {
    return this.currentUrl === '/login' || this.currentUrl.startsWith('/login?');
  }

  navigate(path: string) {
    this.router.navigate([path]);
  }
}



