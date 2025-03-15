import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Profile } from '../../../../shared/models/profile';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { HandlerButtonComponent } from "../../../../shared/components/buttons/handler-button/handler-button.component";
import { SecondaryButtonComponent } from "../../../../shared/components/buttons/secondary-button/secondary-button.component";

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    HandlerButtonComponent,
    SecondaryButtonComponent
]
})
export class ProfileModalComponent {
  name: string;
  email: string;

  constructor(
    public dialogRef: MatDialogRef<ProfileModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { mode: 'create' | 'edit'; profile?: Profile }
  ) {
    this.name = data.mode === 'edit' && data.profile ? data.profile.name : '';
    this.email = data.mode === 'edit' && data.profile?.email ? data.profile.email : '';
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.name) {
      this.dialogRef.close({ name: this.name, email: this.email });
    }
  }
}