import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
// tslint:disable:variable-name
export class LoginComponent implements OnInit {
  form: FormGroup;
  signupForm: FormGroup;
  public loginInvalid: boolean;
  public loginCodeInvalid: boolean;

  private formSubmitAttempt: boolean;
  private signUpFormSubmitAttempt: boolean;

  showLogin = true;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {

  }

  toggleLogin() {
    this.showLogin = !this.showLogin;
  }

  async ngOnInit() {
    this.form = this.fb.group({
      username: ['', Validators.email],
      password: ['', Validators.required]
    });

    this.signupForm = this.fb.group({
      accessCode: ['', Validators.required]
    });
  }

  onSubmit() {
    this.loginInvalid = false;
    this.formSubmitAttempt = false;
    if (this.form.valid) {
      try {
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;
        this.authService.login(username, password).subscribe(response => {
          if (response) {
            this.authService.setUser(response);
            this.router.navigate(['/home']);
          } else {
            this.loginInvalid = true;
          }
        }, error => {
          this.openSnackBar(error.error.status);
          this.loginInvalid = true;
        });
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  onSignupSubmit() {
    this.loginCodeInvalid = false;
    this.signUpFormSubmitAttempt = false;
    if (this.signupForm.valid) {
      try {
        const code = this.form.get('accessCode').value;
        this.authService.signup(code).subscribe(response => {
          if (response == null) {
            this.loginCodeInvalid = true;
          } else {
            // TODO --> GO TO NEXT STEP OF SIGN UP
          }
        });
      } catch (err) {
        this.loginInvalid = true;
      }
    } else {
      this.formSubmitAttempt = true;
    }
  }

  openSnackBar(message: string) {
    this._snackBar.open(message, null, {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

}
