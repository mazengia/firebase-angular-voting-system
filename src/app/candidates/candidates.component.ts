import { Component, OnInit, OnDestroy } from '@angular/core';
import { Candidate } from '../model/Candidate';
import { Subscription } from 'rxjs';
import { CandidateService } from '../services/CandidateService';
import {RouterLink} from "@angular/router";
import {NgForOf} from "@angular/common";
import {AngularFirestore} from "@angular/fire/compat/firestore";
@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [
    RouterLink,
    NgForOf
  ],
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.sass']
})
export class CandidatesComponent implements OnInit, OnDestroy {

  candidates: Candidate[] = [];
  private candidatesSubscription: Subscription = new Subscription();
  constructor(private firestore: AngularFirestore) { }

  ngOnInit(): void {
    console.log("ff=",this.firestore.collection('candidates').valueChanges())
      this.firestore.collection('candidates').valueChanges();


  }

  ngOnDestroy(): void {
    if (this.candidatesSubscription) {
      this.candidatesSubscription.unsubscribe();
    }
  }
}
