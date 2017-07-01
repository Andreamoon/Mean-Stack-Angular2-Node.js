import { Component, OnInit } from '@angular/core';
import{ValidateService} from  '../../services/validate.service';
import{AuthService} from  '../../services/auth.service';
import{FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  name:String;
  username:String;
  email:String;
  password:String;
  temporarytoken:any;
  constructor(
    private validateService:ValidateService,
    private flashMessage:FlashMessagesService,
    private authService:AuthService,
    private router:Router) {
   }

  ngOnInit() {
  }
//metodo che prende i dati dal form
onRegisterSubmit(){
    const user = {
    name:this.name,
    email:this.email,
    username:this.username,
    password:this.password,
    temporarytoken:this.temporarytoken


  }

  // se il form non è compilato correttamente invio un sms con alert-danger
      if(!this.validateService.validateRegister(user)){
        this.flashMessage.show('Per favore completa tutti i campi', {cssClass: 'alert-danger', timeout: 3000});
        return false;//ritorna false quindi ricomincia
      }

      // se la mail inserita non è una stringa di tipo email invio un messaggio e torno false
      if(!this.validateService.validateEmail(user.email)){
        this.flashMessage.show('Per favore inserisci una mail valida', {cssClass: 'alert-danger', timeout: 3000});
        return false;
      }


    // se tutto è andato bene posso passare i dati a un oggetto data
    this.authService.registerUser(user).subscribe(data => {
      console.log(data)
      if(data.success){//e invio un messaggio di success
        this.flashMessage.show(data.msg, {cssClass: 'alert-success', timeout: 3000});
        this.router.navigate(['/login']);
      } else {//invio un messaggio di errore e ti porto al register
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 3000});
        this.router.navigate(['/register']);
      }
    });
}
}
