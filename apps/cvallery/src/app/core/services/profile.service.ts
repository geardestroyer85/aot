import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Profile } from '../../shared/models/profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiUrl = '/api/v1/profiles';

  constructor(private http: HttpClient) { }

  getProfiles(): Observable<Profile[]> {
    return this.http.get<Profile[]>(`${this.apiUrl}`, { withCredentials: true })
  }

  getProfile(id: string): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/${id}`);
  }

  createProfile(name: string, email: string): Observable<Profile> {
    return this.http.post<Profile>(this.apiUrl, { name, email });
  }

  updateProfile(id: string, name: string, email: string): Observable<Profile> {
    return this.http.put<Profile>(`${this.apiUrl}/${id}`, { name, email });
  }

  deleteProfile(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}