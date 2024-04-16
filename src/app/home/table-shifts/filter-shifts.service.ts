import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterShiftsService {

  constructor(private fire: Firestore) { }

  async getShiftsForRegularUserDate(sDate: any, eDate: any){
    const auth = getAuth();
    return new Observable((observer) =>{
      auth.onAuthStateChanged(async(user) =>{
        try{
          if(user){
            const userId = user.uid;
            const userDocRef = doc(this.fire, 'users', userId);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            if(sDate && eDate){
              const startDate = new Date(sDate);
              const endDate = new Date(eDate);

              const filteredShifts = userData['shifts'].filter((shift:any) =>{
                const shiftDate = new Date(shift.shiftDate);
                return shiftDate >= startDate && shiftDate <= endDate
              })
              observer.next(filteredShifts);
            }else{
              observer.next(userData['shifts']);
            }
          }else{
            return;
          }
        }catch(err){
          console.log('err', err);
        }
      })
    })
  }

  async getShiftsForRegularUserShiftWorkplace(shiftWorkplace: any){
    const auth = getAuth();
    return new Observable((observer) =>{
      auth.onAuthStateChanged(async (user) =>{
        try{
          if(user){
            const userDocRef = doc(this.fire, 'users', user.uid);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            if(shiftWorkplace){
              const filteredShiftsByName = userData['shifts'].filter((shift:any) =>{
                return shift.workplace.includes(shiftWorkplace);
              })
              observer.next(filteredShiftsByName);
            }
            else{
              observer.next(userData['shifts']);
          }
          }
          else{
            observer.next();
            return;
          }
        }catch(err){
          console.log('Error', err)
        }
      })
    })
  }

  async resetFilter() {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (user) {
            const userId = user.uid;
            const userDocRef = doc(this.fire, 'users', userId);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            observer.next(userData['shifts']);
          } else {
            return;
          }
        } catch (err) {
          console.log('Error', err);
        }
      });
    });
  }
}
