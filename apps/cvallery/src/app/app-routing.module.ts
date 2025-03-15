import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  { 
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    canActivate: [AuthGuard]
  },
  { 
    path: 'profiles', 
    loadComponent: () => import('./features/profiles/profiles.component').then(c => c.ProfilesComponent), 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent) 
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/register/register.component').then(c => c.RegisterComponent) 
  },
  { 
    path: '**', 
    redirectTo: '/home' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }