import {Component} from '@angular/core';
import {NgIf} from '@angular/common';
import {FireAuthService} from "../services/fireauth.service";
import {Observable} from "rxjs";
import {AngularFirestore} from "@angular/fire/compat/firestore";
import { addDoc, collection, deleteDoc, doc, Firestore, getDoc, setDoc, updateDoc, query, where, getDocs } from '@angular/fire/firestore';
import {FirestoreService} from "../services/firestore.service";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    imports: [
        NgIf
    ],
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    currentUser: any;

    constructor(private authService: FireAuthService,private firestore: Firestore) {
        this.currentUser = this.authService.getCurrentUser();
        this.getAllRestaurants();
    }

    logout() {
        this.authService.signOut().then(res => {
        });
    }
    getAllRestaurants(): void {
        const collectionRef = collection(this.firestore, 'candidates');
        console.log("Collection Reference: ", collectionRef);
        getDocs(collectionRef)
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("No restaurants found.");
                    return;
                }

                querySnapshot.docs.forEach((doc) => {
                    const restaurantData = doc.data();
                    console.log("Restaurant data:", restaurantData);
                });
            })
            .catch((error) => {
                console.error("Error getting restaurants:", error);
            });
    }
}
