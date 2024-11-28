import {Component, OnInit, OnDestroy, Inject} from '@angular/core';
import {Subscription} from 'rxjs';
import {RouterLink} from '@angular/router';
import {NgFor, NgIf} from '@angular/common';
import {FirestoreService} from '../services/firestore.service';
import {Candidate} from '../model/Candidate';
import {MatList, MatListItem} from "@angular/material/list";
import {
  MatCard,
  MatCardActions,
  MatCardHeader,
  MatCardImage,
  MatCardSubtitle,
  MatCardTitle
} from "@angular/material/card";
import {MatAnchor, MatButton, MatIconButton} from "@angular/material/button";
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

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [
    RouterLink,
    NgFor,
    MatList,
    MatListItem,
    MatCard,
    MatCardHeader,
    MatCardActions,
    MatCardImage,
    MatAnchor,
    MatIcon,
    MatCardTitle,
    MatCardSubtitle,
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

  constructor(private firestoreService: FirestoreService, private dialog: MatDialog, private breakpointObserver: BreakpointObserver) {
  }

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
    this.getAllCandidates();
  }

  toggleSideNav() {
    // Logic for toggling the sidenav
  }
  getAllCandidates() {
    this.candidatesSubscription = this.firestoreService.getAllCandidates().subscribe(
      (candidates: Candidate[]) => {
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
