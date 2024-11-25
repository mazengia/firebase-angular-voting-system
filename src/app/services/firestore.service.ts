import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, setDoc, updateDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: Firestore) { }

  // Create a new document in Firestore
  private async createDocument(docPath: string, data: any): Promise<void> {
    const docReference = doc(this.firestore, docPath);
    await setDoc(docReference, data);
  }

  // Add a new document to a collection
  private async addDocument(collectionPath: string, data: any): Promise<string> {
    const collectionRef = collection(this.firestore, collectionPath);
    const docRef = await addDoc(collectionRef, data);
    return docRef.id;
  }

  // Get a single document from Firestore
  private async getDocument<T>(docPath: string): Promise<T | null> {
    const docReference = doc(this.firestore, docPath);
    const docSnap = await getDoc(docReference);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  }



  // Get nearby restaurants (example with filtering or geolocation query)
  getNearbyRestaurants(): void {
    const collectionRef = collection(this.firestore, 'candidates');
    const nearbyQuery = query(collectionRef, where("location", "==", "nearby")); // Example query
    getDocs(nearbyQuery).then((querySnapshot) => {
      querySnapshot.docs.forEach((doc) => {
        const restaurantData = doc.data();
        console.log("Nearby restaurant:", restaurantData);
      });
    });
  }

  // Update an existing document in Firestore
  private async updateDocument(docPath: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await updateDoc(docRef, data);
  }

  // Delete a document from Firestore
  private async deleteDocument(docPath: string): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }
}
