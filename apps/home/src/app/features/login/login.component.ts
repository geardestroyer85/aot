import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'] // corrected styleUrl to styleUrls
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.username && this.password) {
      console.log(this.username, this.password)
      this.authService.login({username: this.username, password: this.password}).subscribe(
        (response) => {
          console.log('Login successful:', response);
          this.router.navigate(['/']); // Redirect after login
          this.errorMessage = null; // Clear error message on successful login
        },
        (error) => {
          console.error('Login failed:', error);
          this.errorMessage = error.error.message || 'An error occurred while logging in'; // Set error message
        }
      );
    }
  }
}
