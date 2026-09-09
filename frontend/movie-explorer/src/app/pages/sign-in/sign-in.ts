import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {

  showPassword = false;

  signInForm = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.email
      ]
    }),

    password: new FormControl('', {
      validators: [
        Validators.required,
        Validators.minLength(8)
      ]
    })
  });

  get email() {
    return this.signInForm.controls.email;
  }

  get password() {
    return this.signInForm.controls.password;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {

    if (this.signInForm.invalid) {
      this.signInForm.markAllAsTouched();
      return;
    }

    console.log('Email:', this.email.value);
    console.log('Password:', this.password.value);

    console.log('Sign in form is valid!');
  }
}