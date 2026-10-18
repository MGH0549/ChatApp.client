import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AccountService } from '../services/account.service';
import { RegisterModel } from '../models/register-model';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Component({
  imports: [CommonModule, ReactiveFormsModule],
  selector: 'app-register',
  styleUrl: './register.css',
  templateUrl: './register.html',
})
export class Register implements OnInit {
  private readonly accountService = inject(AccountService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  @Output() cancelRegister = new EventEmitter<boolean>();

  submitted = false;
  requestError = '';
ngOnInit(): void {
  this.controls
}
  registerForm = this.formBuilder.nonNullable.group(
    {
      username: ['', [Validators.required, Validators.minLength(3)]],
      knownAs: ['', Validators.required],
      gender: ['male', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: this.passwordsMatchValidator }
  );

  get controls() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.requestError = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

     const dob = this.getDateOnly(this.registerForm.controls['dateOfBirth'].value);
    const values = {...this.registerForm.value, dateOfBirth: dob};
    this.accountService.register(values).subscribe({
      next: (result) => {
        console.log(result);
      },
      error: error => {
        this.requestError = error;
        console.log(error);
      } 
    })
  }
  private getDateOnly(dob: string | undefined) {
    if (!dob) return;
    let theDob = new Date(dob);
    return new Date(theDob.setMinutes(theDob.getMinutes()-theDob.getTimezoneOffset()))
      .toISOString().slice(0,10);
  }

  onCancel(): void {
    this.cancelRegister.emit(false);
  }

  private passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
