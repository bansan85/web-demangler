import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { LogoDemanglerInlineComponent } from './img/logo-demangler-inline.component';
import { LogoFormatterInlineComponent } from './img/logo-formatter-inline.component';
import { LogoNamingStyleInlineComponent } from './img/logo-naming-style-inline.component';
import { GithubMarkInlineComponent } from './img/github-mark-inline.component';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LogoDemanglerInlineComponent,
    LogoFormatterInlineComponent,
    LogoNamingStyleInlineComponent,
    GithubMarkInlineComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private router: Router) { }

  isHomeRoute() {
    return this.router.url === '/';
  }
}
