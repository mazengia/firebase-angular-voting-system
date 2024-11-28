import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  getDocFromServer,
  getDocs,
  updateDoc
} from '@angular/fire/firestore';
import {Observable} from "rxjs";
import {Candidate} from "../model/Candidate";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private firestore: Firestore
  ) {
  }

  async addNewRecord(newData: Candidate): Promise<void> {
    try {
      const collectionRef = collection(this.firestore, 'candidates');
      const docRef = await addDoc(collectionRef, newData);
      console.log("Document added with ID: ", docRef.id);
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  }


  getAllCandidates(): Observable<Candidate[]> {
    const collectionRef = collection(this.firestore, 'candidates');

    return new Observable((observer) => {
      getDocs(collectionRef)
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            observer.next([]); // No data found, return empty array
          } else {
            const candidates = querySnapshot.docs.map(doc => doc.data() as Candidate);
            observer.next(candidates); // Emit the candidate data
          }
        })
        .catch((error) => {
          console.error('Error getting candidates:', error);
          observer.next([]); // In case of error, return empty array
        });
    });
  }


  private async addDocument(collectionPath: string, data: any) {
    const collectionRef = collection(this.firestore, collectionPath);
    const doc = await addDoc(collectionRef, data);
    return doc.id;
  }

  private async getDocument<T>(docPath: string): Promise<T | null> {
    const docReference = doc(this.firestore, docPath);
    const docSnap = await getDocFromServer(docReference);
    if (docSnap.exists()) {
      return docSnap.data() as T;
    }
    return null;
  }

  private async updateDocument(collectionPath: string, data: any): Promise<void> {
    const docRef = doc(this.firestore, collectionPath);
    await updateDoc(docRef, data);
  }

  private async deleteDocument(docPath: string): Promise<void> {
    const docRef = doc(this.firestore, docPath);
    await deleteDoc(docRef);
  }
}
