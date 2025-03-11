import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    canActivate: [AuthGuard],
    data: { authType: 'private'}
  },
  { 
    path: 'login', 
    loadComponent: () => import('./features/login/login.component').then(c => c.LoginComponent),
    canActivate: [AuthGuard],
    data: { authType: 'public'}
  },
  { 
    path: 'register', 
    loadComponent: () => import('./features/register/register.component').then(c => c.RegisterComponent),
    canActivate: [AuthGuard],
    data: { authType: 'public'}
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }