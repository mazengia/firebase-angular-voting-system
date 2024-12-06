import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FirestoreService} from "../services/firestore.service";
import {FormsModule} from "@angular/forms";
import {FireStorageService} from "../services/firestorage.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-update-candidate',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './update-candidate.component.html',
  styleUrl: './update-candidate.component.css'
})
export class UpdateCandidateComponent implements OnInit{
  updatedCandidate = {
    documentId: '',
    name: '',
    description: '',
    imageUrl: '',
  };
  imageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  constructor(
    private firestoreService: FirestoreService,
    private fireStorageService: FireStorageService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    const candidateId = this.route.snapshot.paramMap.get('id');  // Use 'id' parameter from URL

    if (candidateId) {
      this.firestoreService.getCandidateById(candidateId)
        .then(candidate => {
          if (candidate) {
            this.updatedCandidate = { ...candidate };
            this.updatedCandidate.documentId = candidateId; // Add document ID for update
          } else {
            console.error('Candidate not found!');
            this.router.navigate(['/candidates']).then(r => {});
          }
        })
        .catch(error => {
          console.error('Error fetching candidate:', error);
          this.router.navigate(['/candidates']).then(r => {});
        });
    } else {
      console.error('Invalid candidate ID');
      this.router.navigate(['/candidates']).then(r => {});
    }
  }

  onUpdateFileSelected(event: any): void {
    this.imageFile = event.target.files[0];
    if (this.imageFile) {
      this.imagePreviewUrl = URL.createObjectURL(this.imageFile);
    }
  }

  async updateCandidate(): Promise<void> {
    if (this.imageFile) {
      try {
        this.updatedCandidate.imageUrl = await this.fireStorageService.uploadFile(this.imageFile);
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    try {
      await this.firestoreService.updateRecord(
        this.updatedCandidate.documentId,
        this.updatedCandidate
      );
      this.router.navigate(['/candidates']);
    } catch (error) {
      console.error('Error updating candidate:', error);
    }
  }
}
