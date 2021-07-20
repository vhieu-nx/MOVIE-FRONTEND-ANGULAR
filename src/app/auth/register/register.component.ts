import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/auth.service';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Router} from '@angular/router';
import {NotifierService} from 'angular-notifier';
import { ErrorStateMatcher } from '@angular/material/core';
import {catchError, debounceTime, distinctUntilChanged, first, map, switchMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(private authService: AuthService,
              private formBuilder: FormBuilder,
              private router: Router,
              private notifierService: NotifierService) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern('\\b[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\\..+\\b')],
                  [this.validateAsyncEmail.bind(this)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(256)]],
      confirmPassword: ['', Validators.required]
    }, {validator: this.passwordsMatch('password', 'confirmPassword').bind(this)});
  }

  get form(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  register(): void {
    this.authService.register(
      {
        email: this.form.email.value,
        password: this.form.password.value
      }
    )
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/auth/login']);
        }
      });
  }

  validateAsyncEmail(control: AbstractControl): Observable<ValidationErrors | null> {
    return control.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(() => this.authService.emailExists({email: control.value})),
      map(emailExists => emailExists ? { emailTaken: true } : null),
      catchError(() => of(null)),
      first()
    );
  }

  passwordsMatch(controlName: string, matchingControlName: string): (formGroup: FormGroup) => any {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

}
