import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';

@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  id:any;
  temporarytoken:any;

  constructor(private http:Http ) {
    //  this.id = af.user;


   }
//questa è la routes della registrazione
  registerUser(user){
    let headers = new Headers();

    headers.append('Content-Type','application/json');
    return this.http.post('http://localhost:3000/users/register', user,{headers: headers})
      .map(res => res.json());
  }
  //questa è la routes di login
  authenticateUser(user){
  let headers = new Headers();
  headers.append('Content-Type','application/json');
  return this.http.post('http://localhost:3000/users/authenticate', user,{headers: headers})
    .map(res => res.json());
}


//metodo per visulizzare il profilo della persona loggata tramite il token
  getProfile(): Promise<any>{
    let headers = new Headers();//route di tipo get
    this.loadToken();//chiamata il metodo loadToken all oggetto headers appendo il token
    headers.append('Authorization',this.authToken);
    headers.append('Content-Type','application/json');
    return new Promise((resolve : Function, reject : Function) =>{
      this.http.get('http://localhost:3000/users/profile',{headers: headers})
      .map(res=> res.json()).subscribe(data => {
         resolve(data);
    },   (error) => {
         reject(error);
         });
       });

}
putProfile(id,user): Promise<any>{
   let headers = new Headers();
   this.loadToken();
   headers.append('Authorization',this.authToken);
   headers.append('Content-Type','application/json');

   return new Promise((resolve : Function, reject : Function) =>{
     this.http.put('http://localhost:3000/users/'+id,user,{headers: headers})
     .map(res=> res.json()).subscribe(data => {
        resolve(data);
   },   (error) => {
        reject(error);
        });
      });
   }






   deleteProfile(id){
     let headers = new Headers();
     this.loadToken();
     headers.append('Authorization',this.authToken);
     headers.append('Content-Type','application/json');

     return new Promise((resolve : Function, reject : Function) =>{
       this.http.delete('http://localhost:3000/users/'+id,{headers: headers})
       .map(res=> res.json()).subscribe(data => {
          resolve(data);
     },   (error) => {
          reject(error);
          });
        });
   }
   activateAccount(user){





   }




//metodo per memorizzare token e user che mi verrano passtati
storeUserData(token, user){//uso id_token perchè jwt richiede questo
    localStorage.setItem('id_token', token);// questo cast a json perhce localStorage accetta solo stringhe
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }
//vdao a prendere dal localStorage il token e lo inserico in authToken
 loadToken(){
   const token = localStorage.getItem('id_token');
   this.authToken = token;//e setto la variabile authToken con il token
 }
 //prendo il token temporarytoken dal db e lo inserico in this,temporarytoken
 loadTemporaryToken(){
   var temporarytoken = localStorage.getItem('temporarytoken');
   this.temporarytoken = temporarytoken;
 }
//metodo controlla il token se è valido e che utilizzo per nascondere la pagina profilo e dashboar in base alla validita del token
loggedIn(){
    //al tokenNotExpired passo il token cosi funziona bene
    return tokenNotExpired('id_token');
  }
//meto di logout
logout(){
  this.authToken = null;//annullo il token
  this.user = null;//annullo utente
  localStorage.clear();//cancello i localStorage

}

}
