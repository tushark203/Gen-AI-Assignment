import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule,NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

 loginData = {
    username: '',
    password: ''
  };

  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin(): void {
    this.http.post<{ token: string }>('http://localhost:8080/auth/login', this.loginData)
      .subscribe({
        next: (response) => {
          const token = response.token;
       
          const payload = this.decodeJWT(token);

          if (payload?.sub === 'admin') {
            localStorage.setItem('token', token); // optionally store token
            this.router.navigate(['/admin']);
          } else {
            this.errorMessage = 'You cannot access admin panel';
          }
        },
        error: () => {
          this.errorMessage = 'Invalid credentials or server error';
        }
      });
  }

  // Utility function to decode JWT
  private decodeJWT(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      return null;
    }
  }


}
