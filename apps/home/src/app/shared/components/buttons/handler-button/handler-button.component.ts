import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-handler-button',
  standalone: true,
  imports: [MatButtonModule],
  templateUrl: './handler-button.component.html',
  styleUrl: './handler-button.component.scss'
})
export class HandlerButtonComponent {
  @Input() color!: string;
  @Input() disabled: boolean = false;
  @Output() buttonClick = new EventEmitter<void>(); // ✅ Avoids conflict with native click

  // handleClick(event: Event): void {
  //   event.stopPropagation(); // ✅ Prevents event bubbling
  //   event.preventDefault();  // ✅ Prevents unintended default behavior
  //   this.buttonClick.emit();
  // }
}
