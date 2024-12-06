import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {FormsModule} from "@angular/forms";
import {FirestoreService} from "../services/firestore.service";
import {FireStorageService} from "../services/firestorage.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-add-ancicate',
  standalone: true,
  templateUrl: './add-ancicate.component.html',
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrl: './add-ancicate.component.css'
})
export class AddAncicateComponent {
  id = '';
  name = '';
  description = '';
  imageUrl = '';
  imageFile: File | null = null;
  imagePreviewUrl: string | null = null;
  constructor(
    private firestoreService: FirestoreService,
    private fireStorageService: FireStorageService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    this.imageFile = event.target.files[0];

    if (this.imageFile) {
      this.imagePreviewUrl = URL.createObjectURL(this.imageFile);  // Create a preview URL
    }
  }

  async addCandidate(): Promise<void> {
    if (this.imageFile) {
      try {
        this.imageUrl = await this.fireStorageService.uploadFile(this.imageFile);
      } catch (error) {
        console.error('Error uploading image:', error);
        return;
      }
    }

    const requestData = {
      id: this.id,
      name: this.name,
      description: this.description,
      imageUrl: this.imageUrl,
      documentId: "",
      voteCount: 0,
      percentage: 0
    };

    try {
      await this.firestoreService.addNewRecord(requestData);
      await this.router.navigate(['/candidates']);
    } catch (error) {
      console.error('Error adding candidate:', error);
    }
  }
}
