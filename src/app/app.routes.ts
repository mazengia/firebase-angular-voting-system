import {Routes} from '@angular/router';
import {AddAncicateComponent} from './add-ancicate/add-ancicate.component';
import {AuthGuard} from './auth.guard';
import {CandidatesComponent} from './candidates/candidates.component';
import {HomeComponent} from './home/home.component';
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sign-in',
    component: SignInComponent
  },

  {
    path: 'sign-up',
    component: SignUpComponent,
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'add-candidate',
    component: AddAncicateComponent,
  },

];

