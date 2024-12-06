import {Routes} from '@angular/router';
import {AddAncicateComponent} from './add-ancicate/add-ancicate.component';
import {AuthGuard} from './auth.guard';
import {CandidatesComponent} from './candidates/candidates.component';
import {SignInComponent} from "./sign-in/sign-in.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {ForgotPasswordComponent} from "./forgot-password/forgot-password.component";
import {UpdateCandidateComponent} from "./update-candidate/update-candidate.component";

export const routes: Routes = [

  {
    path: 'sign-in',
    component: SignInComponent
  },

  {
    path: 'sign-up',
    component: SignUpComponent,
  },{
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },
  {
    path: 'candidates',
    component: CandidatesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: CandidatesComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'add-candidate',
    component: AddAncicateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'update-candidate/:id',
    component: UpdateCandidateComponent,
    canActivate: [AuthGuard]
  }

];

