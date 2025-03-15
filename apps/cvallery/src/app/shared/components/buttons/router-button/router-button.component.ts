import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-router-button',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './router-button.component.html',
  styleUrl: './router-button.component.scss'
})
export class RouterButtonComponent {
  @Input() color!: string;
  @Input() routerLink!: string;
}
