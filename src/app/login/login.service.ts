import { Injectable } from '@angular/core';
import { getAuth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  invalidCredentials: boolean = false;

  constructor(private fire: Firestore) {}

  async loginFunc(email: string, password: string): Promise<boolean> {
    try {
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, email, password);
      this.invalidCredentials = false;
      return true;
    } catch (err) {
      this.invalidCredentials = true;
      return false;
    }
  }

  async getCurrentUser(): Promise<any> {
    const auth =  getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        if(user){
          let userRef = doc(this.fire, 'users', user.uid);
          let userDoc = await getDoc(userRef);

          if(userDoc.exists()){
            const userData = {
              ...user,
              ...userDoc.data()
            }
            observer.next(userData);
          }
          
        }else{
          observer.next(null);
        }
      })
    })
  }

  
}
