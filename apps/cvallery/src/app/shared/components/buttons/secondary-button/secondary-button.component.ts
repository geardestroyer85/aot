import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-secondary-button',
  standalone: true,
  imports: [MatButtonModule, RouterModule],
  templateUrl: './secondary-button.component.html',
  styleUrl: './secondary-button.component.scss'
})
export class SecondaryButtonComponent {
  @Input() color!: string;
  @Input() disabled!: boolean;
  @Output() click = new EventEmitter<void>();

  handleClick(): void {
    this.click.emit()
  }
}
