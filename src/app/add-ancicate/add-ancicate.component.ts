import { Component } from '@angular/core';
import { Candidate } from '../model/Candidate';
import { CandidateService } from '../services/CandidateService';
import { Router } from '@angular/router';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";
@Component({
  selector: 'app-add-ancicate',
  standalone: true,
  templateUrl: './add-ancicate.component.html',
  imports: [
    FormsModule
  ],
  styleUrl: './add-ancicate.component.sass'
})
export class AddAncicateComponent {
  id= '';
  name= '';
  description= '';
  imageUrl= '';
  constructor(
    private candidateService: CandidateService,
    private router: Router
  ) { }

  addCandidate(): void {
    let x={
      id: this.id,
      name:this.name,
      description:this.description,
      imageUrl:this.imageUrl
    }
    this.candidateService.addCandidate(x);
    this.router.navigate(['/candidates']); // Redirect to the candidates list
  }
}
