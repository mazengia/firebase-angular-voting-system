import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FireAuthService} from "../services/fireauth.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: FireAuthService, private router: Router) {}

  signUp() {
    if (this.email && this.password) {
      this.authService.signUpWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          console.log('User signed up successfully:', user);
          this.router.navigate(['/sign-in']);  // Redirect to home after successful sign up
        },
        (error) => {
          this.errorMessage = error.message;
          console.error('Sign up error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in both email and password.';
    }
  }
}
