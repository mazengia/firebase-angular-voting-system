import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {FireAuthService} from "../services/fireauth.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [
    FormsModule,
    NgIf
  ]
})
export class SignInComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(private authService: FireAuthService, private router: Router) {}




  signIn() {
    if (this.email && this.password) {
      this.authService.signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          console.log('User signed in successfully:', user);
          this.router.navigate(['/candidates']);  // Redirect to home after successful sign in
        },
        (error) => {
          this.errorMessage = error.message;
          console.error('Sign in error:', error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in both email and password.';
    }
  }
}
