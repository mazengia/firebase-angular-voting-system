import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {FireAuthService} from "../services/fireauth.service";

@Component({
  selector: 'app-home',
  standalone:true,
  templateUrl: './home.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  currentUser: any;

  constructor(private authService: FireAuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.signOut().then(() => {
      console.log('User logged out');
      // Redirect user to sign-in page after logout
    });
  }
}
