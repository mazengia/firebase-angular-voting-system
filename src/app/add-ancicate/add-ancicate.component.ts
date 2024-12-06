import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {FirestoreService} from "../services/firestore.service";
import {FireStorageService} from "../services/firestorage.service";

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
  id = '';
  name = '';
  description = '';
  imageUrl = '';
  imageFile: File | null = null;

  constructor(
    private firestoreService: FirestoreService,
    private fireStorageService: FireStorageService,
    private router: Router
  ) {}

  // Handle file selection
  onFileSelected(event: any): void {
    this.imageFile = event.target.files[0];
  }

  // Add candidate to Firestore after uploading the image
  async addCandidate(): Promise<void> {
    if (this.imageFile) {
      try {
        // Upload image and get the download URL
        this.imageUrl = await this.fireStorageService.uploadFile(this.imageFile);
      } catch (error) {
        console.error('Error uploading image:', error);
        return; // Return early if image upload fails
      }
    }

    // Prepare the candidate data
    const requestData = {
      id: this.id,
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      documentId: "",
      voteCount:0,
      percentage:0
    };

    try {
      // Add the candidate record to Firestore
      await this.firestoreService.addNewRecord(requestData);
      this.router.navigate(['/candidates']);
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  }
}
