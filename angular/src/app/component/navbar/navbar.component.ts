import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FlashMessagesService} from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  user:any;
  constructor(//instanzi delle variabili nel constructor
    private authService:AuthService,
    private router:Router,
    private flashMessage:FlashMessagesService) { }

    //leggo il profilo in arrivo e lo assegno a user
      ngOnInit() {
          this.authService.getProfile().then(profile=>{
          this.user= profile.user;
          //console.log(this.user);
        },
      err => {
        console.log(err);
        return false;
      })
      }
  //metodo di logout
  onLogoutClick(){
       this.authService.logout();//richiamo il probider e invio un sms
       this.flashMessage.show("Hai effettuao il Log-Out",{
       cssClass:'alert-success', timeout:3000});
       location.reload();//metodo di refresh della pagina
       this.router.navigate(['/index']);//reindirizzamento su login
       return false;//return false

       }
}
