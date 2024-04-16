import { Injectable} from '@angular/core';
import { getAuth, updateEmail, updatePassword } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditUserProfileService {

  constructor(private fire: Firestore) { }

  async updateProfileUser(updatedData: any){
    const auth = getAuth();
    return new Observable((observer) =>{
      auth.onAuthStateChanged(async (user) =>{
        try{
          if(user){
            const userId = user.uid;
            if(updatedData.email){
              await updateEmail(user, updatedData.email);
            }
            if(updatedData.password){
              await updatePassword(user, updatedData.password);
            }

            const userDocRef = doc(this.fire, 'users', userId);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            
            const updatedUserData = {...userData, ...updatedData};

            await setDoc(userDocRef, updatedUserData);
            observer.next(updatedUserData);
          }else{
            observer.next(null);
          }
        }catch(err){
          observer.error('Error updating profile');
        }
      })
    })
  }
}
