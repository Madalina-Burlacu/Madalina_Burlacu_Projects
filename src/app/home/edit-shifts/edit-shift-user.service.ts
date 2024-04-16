import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditShiftUserService {

  constructor(private fire: Firestore) { }

  async getShiftByShiftSlug(shiftSlug: string){
   const auth = getAuth();
   return new Observable((observer) =>{
    auth.onAuthStateChanged(async (user) =>{
      try{
        if(user){
          const uid = user.uid;
          const userDocRef = doc(this.fire, 'users', uid);
          const userDoc = getDoc(userDocRef);
          const userData = (await userDoc).data();
          const userShifts = userData['shifts'];
          const userFilteredShift = userShifts.find((el: any) => el.shiftSlug === shiftSlug);
          observer.next(userFilteredShift);
        }else{
          return;
        }
      }catch(err){
        console.log('Error getting shift by shift slug', err);
      }
    })
   })
  }

  async updateShfit(shiftSlug: any, updatedData: any){
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try{
          if(user){
            const userId = user.uid;
            const userDocRef = doc(this.fire, 'users', userId);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            const userShifts = userData['shifts'];
            const userFilteredShift = userShifts.find((el: any) => el.shiftSlug === shiftSlug);
          
            if(userFilteredShift){
              Object.assign(userFilteredShift, updatedData);
              await updateDoc(userDocRef, { shifts: userShifts });
              observer.next(userShifts); 
            }else{
              return;
            }
         }else{
          return;
         }
        }catch(err){
          console.log('err', err)
        }
      })
    })
  }

  calculateDayliPay(hourlyWage: number, startShift: number, endShift: number): number {
    return (endShift - startShift) * hourlyWage;
  }
}
