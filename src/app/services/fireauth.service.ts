import {Injectable} from '@angular/core';
import {
  Auth, authState, createUserWithEmailAndPassword, sendPasswordResetEmail,
  signInWithEmailAndPassword, User, UserCredential
} from '@angular/fire/auth';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {Users} from "../model/user";
import {FirestoreService} from "./firestore.service";

@Injectable({
  providedIn: 'root'
})
export class FireAuthService {
  private user: User | null = null;

  constructor(private auth: Auth, private firestoreService: FirestoreService) {
    this.listenToAuthStateChanges();
  }

  // Listent to auth state changes
  private listenToAuthStateChanges(): void {
    authState(this.auth).subscribe((user: User | null) => {
      if (user) {
        // User is signed in
      } else {
        // User is signed out
      }
    });
  }

  public async signUpWithEmailAndPassword(user: Users): Promise<UserCredential> {
    const cred = await createUserWithEmailAndPassword(
      this.auth, user.email, user.password);
    if (cred?.user) {
      await this.firestoreService.addNewUser(user, cred)
      this.user = cred.user;
    }
    return cred;
  }

  // Sign up with email and password
  public signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Sign out
  public async signOut(): Promise<void> {
    await this.auth.signOut();
  }

  // Send password reset email
  public async sendPasswordResetEmail(email: string): Promise<void> {
    return sendPasswordResetEmail(this.auth, email);
  }

  getCurrentUser() {
    return this.auth.currentUser?.uid;
  }


}
