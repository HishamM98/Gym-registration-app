import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl: string = env.apiUrl;

  constructor(private http: HttpClient) {}

  postRegistration(registerObj: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/enquiry`, registerObj);
  }

  getRegisteredUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/enquiry`);
  }

  updateRegisteredUser(updatedUser: User, id: number): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/enquiry/${id}`, updatedUser);
  }

  deleteRegisteredUser(id: number): Observable<User> {
    return this.http.delete<User>(`${this.apiUrl}/enquiry/${id}`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/enquiry/${id}`);
  }
}
