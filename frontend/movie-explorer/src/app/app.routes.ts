import { Routes } from '@angular/router';
import { SignIn } from './pages/sign-in/sign-in';
import {Movies} from './pages/movies/movies';

export const routes: Routes = [
  { path: '', component: SignIn},
  {
  path: 'movies',
  component: Movies
}
];