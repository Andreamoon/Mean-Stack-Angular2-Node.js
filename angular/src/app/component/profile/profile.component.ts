import { Component, OnInit,OnChanges,DoCheck} from '@angular/core';
import{ValidateService} from  '../../services/validate.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges,DoCheck {
  user:any;
  id:any;
  name:String;
  username:String;
  email:String;
  password:String;
  boolean:boolean = false;
//////////////////////
 form: FormGroup;
  constructor(private authService:AuthService,
              private router:Router,
              private flashMessage:FlashMessagesService,
              private validateService:ValidateService,
             ) {

              this.ngOnInit();
            }

ngDoCheck(){
  //this.refresh();


  console.log('DoCheck')
}
ngOnChanges(){
      this.refresh();
      console.log('OnChanges')
    }

//leggo il profilo in arrivo e lo assegno a user
  ngOnInit() {
    this.authService.getProfile().then(profile=>{
      this.user= profile.user;
    //  console.log(profile);
      this.id = profile.user_id
      //console.log(profile.user._id)


    })
  }//metodo che al click scroll in altro la pagina
  scrollUp(){
      window.scroll(0, 0)
  }

  //associo questo metodo al form che mi intercetta username  e password
    changeData(){
      const user = {
        name: this.name,
        username: this.username,
        email:this.email,
        password: this.password
      }
      // se la mail inserita non è una stringa di tipo email invio un messaggio e torno false
      if(!this.validateService.validateEmail(user.email)){
        this.flashMessage.show('Per favore inserisci una mail valida', {cssClass: 'alert-danger', timeout: 5000});

        return false
      }//richiamo la put dal service e gli assegno l'id del profilo e user in cui ci sono i dati modi
     this.authService.putProfile(this.user._id,user).then(profile =>{
       this.user = user;

     })
  }
  deleteProfile(){
    this.authService.deleteProfile(this.user._id).then(profile =>{
      this.authService.logout();
      this.refresh();

    })

  }
//metodo per cambiare da false a true cliccando sul bottone aggiorna
    changeBool(){
      this.boolean= true;
      console.log(this.boolean);

    }

    refresh(){
      location.reload();

    }

}
