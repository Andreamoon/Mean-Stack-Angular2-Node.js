import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {AuthService} from '../services/auth.service';

@Injectable()//questa classe mi serve a proteggere le pagine che non devono essere visualizzate in base al login
export class AuthGuard implements CanActivate{//nell appmodule va aggiunto anche al providers
  constructor(private authService:AuthService, private router:Router){

  }

  canActivate(){//se loggato torna true
    if(this.authService.loggedIn()){
      return true;
    } else {// altrimeneni reindirizzamento alla login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
