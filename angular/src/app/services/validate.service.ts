import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }
  //creo una funzione di validazione del form per controllare che tutti i campi siano stati compilati
  validateRegister(user){
    if(user.name == undefined    ||
      user.email == undefined    ||
      user.username == undefined ||
      user.password == undefined){
      return false;
    } else {
      return true;
    }
  }
  //metodo per la validazione della è-mail ritorna true se la mail va bene altrimenti false
  validateEmail(email){
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
}
