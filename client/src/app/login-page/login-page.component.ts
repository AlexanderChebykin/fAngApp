import {Component, OnDestroy, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { Subscription } from 'rxjs'
import { MaterialService } from '../shared/classes/material.service'
import { AuthService } from '../shared/services/auth.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent implements OnInit, OnDestroy {

  form!: FormGroup
  aSub!: Subscription

  constructor(private auth: AuthService, 
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(6)])
    })

    this.route.queryParams.subscribe((params: Params) => {
      if(params['registered']){
        MaterialService.toast('Теперь вы можете войти в систему, используя свои данные')
      }
      else if(params['accessDenied']){
        MaterialService.toast('Для начала авторизуйтесь')
      }
      else if (params['sessionFailed']) {
      MaterialService.toast('Пожалуйста войдите в систему заного')
    }
    })
  }

  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()

    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['overview']),
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
