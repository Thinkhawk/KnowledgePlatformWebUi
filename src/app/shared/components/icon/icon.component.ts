import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type AppIconName = 'project' | 'team' | 'notes' | 'dashboard';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './icon.component.html',
  styles: [`
    :host { display: inline-flex; align-items: center; }
    svg { display: block; }
  `]
})
export class IconComponent {
  @Input() name: AppIconName = 'project';
  @Input() size: number = 20;
  @Input() strokeWidth: number = 2;
}
