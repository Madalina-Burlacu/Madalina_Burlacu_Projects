import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DisplayShiftsUserService {

  constructor(private fire: Firestore) { }

  async deleteShift(shiftSlug: string){
    const auth = getAuth();
    return new Observable((observer) =>{
      auth.onAuthStateChanged(async (user) =>{
        try{
          if(user){
            const userId = user.uid;
            const userDocRef = doc(this.fire, 'users', userId);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            if(userData['shifts']){
              const shiftIndex = userData['shifts'].findIndex((shift: { shiftSlug: string; }) =>
                shift.shiftSlug === shiftSlug);
                userData['shifts'].splice(shiftIndex, 1);
              
            }
            await updateDoc(userDocRef, {
              shifts: userData['shifts']
            })
            observer.next(userData['shifts']);
          }else{
            return;
          }
        }catch(err){
          console.log('err', err);
        }
      })
    })
  }
}
