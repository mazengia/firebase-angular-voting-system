import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Subscription} from 'rxjs';
import {Router, RouterLink} from '@angular/router';
import {NgFor, NgIf} from '@angular/common';
import {FirestoreService} from '../services/firestore.service';
import {Candidate} from '../model/Candidate';
import {
  MatCard,
  MatCardActions,
  MatCardHeader,
  MatCardImage,
  MatCardTitle
} from "@angular/material/card";
import {MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatToolbar} from "@angular/material/toolbar";
import {FireAuthService} from "../services/fireauth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardImage,
    MatIcon,
    MatCardTitle,
    MatButton,
    MatToolbar,
    MatIconButton,
    NgIf
  ],
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css']
})
export class CandidatesComponent implements OnInit, OnDestroy {
  isSmallScreen: boolean = false;
  candidates: Candidate[] = [];
  private candidatesSubscription: Subscription | undefined;
  userId: any = '';
  currentUser: any;
  role: string | null = null;

  constructor(private firestoreService: FirestoreService,
              private router: Router,
              private authService: FireAuthService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar) {

    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.userId = this.authService.getCurrentUser();
    console.log("this.userId=",this.userId)
    this.firestoreService.getUserRole().then(
      (role: any) => {
        this.role = role;
      });

    this.getAllCandidates();
  }

  toggleSideNav() {
  }


  openDescriptionDialog(description: any): void {
    this.dialog.closeAll();
    this.dialog.open(DescriptionDialogComponent, {
      data: {description},
      width: '400px',
      disableClose: true,
      panelClass: 'centered-dialog',
    });
  }


  getAllCandidates() {
    this.candidatesSubscription = this.firestoreService.getAllCandidates().subscribe(
      (candidates: Candidate[]) => {
        console.log("candidates=", candidates)
        this.candidates = candidates;
      },
      (error) => {
        console.error("Error fetching candidates:", error);
      }
    );
  }

  ngOnDestroy(): void {
    if (this.candidatesSubscription) {
      this.candidatesSubscription.unsubscribe();
    }
  }

  vote(candidateId: any) {
    this.firestoreService.hasVoted(this.userId).then(hasVoted => {
      if (hasVoted) {
        alert('You have already voted!');
      } else {
        this.firestoreService.incrementVote(candidateId)
          .then(() => {
            this.firestoreService.recordVote(this.userId, candidateId)
              .then(() => {
                console.log('Vote recorded');
                this.getAllCandidates();
              })
              .catch(error => {
                console.error('Error recording vote:', error);
              });
          })
          .catch(error => {
            console.error('Error voting:', error);
          });
      }
    }).catch(error => {
      console.error('Error checking if user has voted:', error);
    });
  }

  deleteRecord(candidateId: any): void {
    this.firestoreService.deleteRecord(candidateId).then(() => {
      this.snackBar.open('Candidate deleted successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar'],
      });
      window.location.reload();
    }).catch(error => {
      this.snackBar.open('Error deleting candidate. Please try again.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    });
  }

  logout() {
    this.authService.signOut().then(res => {
      this.router.navigate(['/sign-in']);
    });
  }
}


@Component({
  selector: 'app-description-dialog',
  standalone: true,
  template: `
    <body align="center">
    <h2 mat-dialog-title>Slogan Description</h2>
    <mat-dialog-content class="mat-typography">
      <p>
        {{ data.description }}
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
    </body>

  `,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogTitle,
    MatButton,
    MatDialogClose
  ]
})
export class DescriptionDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { description: string }) {
  }
}
