import {Component, OnDestroy, OnInit} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { Subscription } from 'rxjs'
import { AuthService } from '../shared/services/auth.service'
import { MaterialService } from '../shared/classes/material.service'

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

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
    })
  }

  ngOnDestroy(){
    if(this.aSub){
      this.aSub.unsubscribe()
    }
  }

  onSubmit() {
    this.form.disable()

    this.aSub = this.auth.register(this.form.value).subscribe(
      () => this.router.navigate(['/login'], {
        queryParams:{
          registered:true
        }
      }),
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
  }

}
