import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProfileService } from '../../core/services/profile.service';
import { Profile } from '../../shared/models/profile';
import { ProfileModalComponent } from './components/profile-modal/profile-modal.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterButtonComponent } from "../../shared/components/buttons/router-button/router-button.component";
import { HandlerButtonComponent } from "../../shared/components/buttons/handler-button/handler-button.component";

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    RouterButtonComponent,
    HandlerButtonComponent
],
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.scss']
})
export class ProfilesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'updatedAt', 'actions'];
  dataSource = new MatTableDataSource<Profile>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private profileService: ProfileService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProfiles();
  }

  loadProfiles(): void {
    this.profileService.getProfiles().subscribe(profiles => {
      this.dataSource.data = profiles.sort((a, b) => new Date(b.updatedAt ?? "").getTime() - new Date(a.updatedAt ?? "").getTime());
    });
  }

  openCreateModal(): void {
    // event.stopPropagation(); // Prevents event from bubbling up
    // event.preventDefault();  // Prevents unintended default behavior
  
    if (this.dialog.openDialogs.length > 0) {
      console.log("⚠️ Modal is already open, skipping...");
      return;
    }
  
    console.log('🛠 openCreateModal() called');
    const dialogRef = this.dialog.open(ProfileModalComponent, {
      width: '400px',
      data: { mode: 'create' },
      autoFocus: false,
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('🛠 Modal closed with result:', result);
      if (result) {
        this.profileService.createProfile(result.name, result.email).subscribe(() => this.loadProfiles());
      }
    });
  }
  
  

  openEditModal(profile: Profile): void {
    const dialogRef = this.dialog.open(ProfileModalComponent, {
      width: '400px',
      data: { mode: 'edit', profile },
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.profileService.updateProfile(profile.id, result.name, result.email).subscribe(() => this.loadProfiles());
      }
    });
  }

  deleteProfile(id: string): void {
    if (confirm('Are you sure you want to delete this profile?')) {
      this.profileService.deleteProfile(id).subscribe(() => this.loadProfiles());
    }
  }

  returnToHome(): void {
    this.router.navigate(['/home']); // Navigate to /home
  }
}