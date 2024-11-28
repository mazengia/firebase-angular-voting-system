import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Subscription} from 'rxjs';
import {RouterLink} from '@angular/router';
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
import { MatButton, MatIconButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatToolbar} from "@angular/material/toolbar";
import {BreakpointObserver, Breakpoints} from "@angular/cdk/layout";
import {FireAuthService} from "../services/fireauth.service";

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

  constructor(private firestoreService: FirestoreService, private authService: FireAuthService, private dialog: MatDialog, private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
    this.userId = this.authService.getCurrentUser();


    this.getAllCandidates();
  }

  toggleSideNav() {
    // Logic for toggling the sidenav
  }

  getAllCandidates() {
    this.candidatesSubscription = this.firestoreService.getAllCandidates().subscribe(
      (candidates: Candidate[]) => {
        console.log("candidates=",candidates)
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

  openDescriptionDialog(description: any): void {
    this.dialog.open(DescriptionDialogComponent, {
      data: {description},
      width: '400px', // Adjust the width of the popup
    });
  }



  vote(candidateId: any) {
    console.log("candidateId=",candidateId)
    this.firestoreService.hasVoted(this.userId).then(hasVoted => {
      if (hasVoted) {
        alert('You have already voted!');
      } else {
        // The user has not voted, so proceed with the vote
        this.firestoreService.incrementVote(candidateId)
          .then(() => {
            // Store the vote in the userVotes collection
            this.firestoreService.recordVote(this.userId, candidateId)
              .then(() => {
                console.log('Vote recorded');
                // Optionally, refresh candidates or show a success message
                this.getAllCandidates(); // Reload the candidates after voting
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
}


@Component({
  selector: 'app-description-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Slogan</h2>
    <mat-dialog-content>
      <p>{{ data.description }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
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
