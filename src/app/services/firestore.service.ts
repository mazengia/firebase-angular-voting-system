import {Injectable} from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore, getDoc,
  getDocFromServer,
  getDocs, increment, query,
  updateDoc, where
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
  // Record the user's vote in Firestore
  async recordVote(userId: string, candidateId: string): Promise<void> {
      await addDoc(collection(this.firestore, 'userVotes'), {
        userId: userId,
        candidateId: candidateId,
        timestamp: new Date(),
      });
  }

  getAllCandidates(): Observable<Candidate[]> {
    const collectionRef = collection(this.firestore, 'candidates');
    return new Observable((observer) => {
      getDocs(collectionRef)
        .then((querySnapshot) => {
          if (querySnapshot.empty) {
            observer.next([]); // No data found, return empty array
          } else {
            // Calculate total votes
            const candidates = querySnapshot.docs.map(doc => {
              const candidate = doc.data() as Candidate;
              candidate.documentId = doc.id;  // Attach the documentId to the candidate
              return candidate;
            });

            const totalVotes = candidates.reduce((sum, candidate) => sum + (candidate.voteCount || 0), 0);

            // Calculate the percentage for each candidate
            const candidatesWithPercentage = candidates.map(candidate => {
              const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
              return {
                ...candidate,
                percentage: percentage.toFixed(2),  // Round to two decimal places
              };
            });

            observer.next(candidatesWithPercentage); // Emit the candidate data with percentage
          }
        })
        .catch((error) => {
          console.error('Error getting candidates:', error);
          observer.next([]); // In case of error, return empty array
        });
    });
  }


  incrementVote(candidateId: string): Promise<void> {
    const candidateRef = doc(this.firestore, 'candidates', candidateId);

    return getDoc(candidateRef)  // Check if the candidate document exists
      .then(docSnap => {
        if (!docSnap.exists()) {
          console.error(`Candidate with ID ${candidateId} does not exist.`);
          throw new Error(`Candidate with ID ${candidateId} does not exist.`);
        }

        // If the candidate exists, increment the vote count
        return updateDoc(candidateRef, {
          voteCount: increment(1), // Increment vote count
        });
      })
      .catch(error => {
        console.error('Error incrementing vote:', error);
        throw error; // Rethrow error after logging it
      });
  }


  // Check if the user has already voted
  hasVoted(userId: string): Promise<boolean> {
    const userVotesQuery = query(
      collection(this.firestore, 'userVotes'),
      where('userId', '==', userId)
    );

    return getDocs(userVotesQuery).then((snapshot) => !snapshot.empty); // Returns true if the user has voted
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
