import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';



const BASE_URL = ["http://localhost:8080/"]

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  constructor(private http: HttpClient, private router: Router) {

  }

  loginWithGoogle() {
    // Redirect to the backend to initiate OAuth2 login with Google
    window.location.href = 'http://localhost:8080/oauth2/authorization/google'; // Backend URL
  }

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'signup', signRequest)
  }

  login(loginRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'login', loginRequest)
  }

  hello(): Observable<any> {
    return this.http.get(BASE_URL + 'api/hello', {
      headers: this.createAuhtorizationHeader()
    })
  }

  // Méthode pour récupérer les filières
  getFilieres(): Observable<any[]> {
    return this.http.get<any[]>(BASE_URL + 'api/filieres');
  }

  // Déconnexion
  logout(){
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  private createAuhtorizationHeader() {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
      console.log("JWT token found in local storage", jwtToken);
      return new HttpHeaders().set(
        "Authorization", "Bearer " + jwtToken
      )
    } else {
      console.log("JWT token not found in local storage");
    }
    return null;
  }

}