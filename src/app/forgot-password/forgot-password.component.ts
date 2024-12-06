import { Component } from '@angular/core';
import {FireAuthService} from "../services/fireauth.service";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  message: string | null = null;

  constructor(private authService: FireAuthService) {}

  async onForgotPassword(): Promise<void> {
    try {
      await this.authService.forgotPassword(this.email);
      this.message = 'A password reset email has been sent to your email address.';
    } catch (error) {
      this.message = 'Error: ' + (error || 'Unable to send reset email.');
    }
  }
}
