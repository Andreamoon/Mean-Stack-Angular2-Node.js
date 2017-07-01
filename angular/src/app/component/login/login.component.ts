import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;

  constructor(//instanzi delle variabili nel constructor
    private authService:AuthService,
    private router:Router,
    private flashMessage:FlashMessagesService
  ) { }

  ngOnInit() {
  }
//associo questo metodo al form che mi intercetta username  e password
  onLoginSubmit(){
    const user = {
      username: this.username,
      password: this.password
    }
//richiamo il metodo di autenticazione dell utente e sottoscrivo i dati
    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){//e memorizzo il token e l utente
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('Bene hai completato il login', {//invio un sms di login
          cssClass: 'alert-success',
          timeout: 3000});
        this.router.navigate(['dashboard']);//reindirizzamento sulla dashboard
        location.reload();//metodo di refresh della pagina
      } else {
        this.flashMessage.show(data.msg, {//altrimenti invio un sms danger
          cssClass: 'alert-danger',
          timeout: 3000});
        this.router.navigate(['login']);
      }
    });
  }


}
