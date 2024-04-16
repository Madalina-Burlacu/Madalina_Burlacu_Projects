// import { Injectable } from '@angular/core';
// import { getAuth } from '@angular/fire/auth';
// import { Firestore, arrayUnion, doc, getDoc, updateDoc } from '@angular/fire/firestore';
// import { Observable, Observer } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class AddShiftsService {
//   constructor(private fire: Firestore) {}

//   isUniqueSlug: boolean = false;

//   async addNewShift(shifts: any) {
//     const auth = getAuth();
//     let startShift: number;
//     let endShift: number;
  
//     return new Observable((observer: Observer<void>) => {
//       auth.onAuthStateChanged(async (user) => {
//         try {
//           if (!user) {
//             observer.error('No user is authenticated');
//             return;
//           } else {
//             const isShiftSlugUnique = await this.isShiftSlugUnique(user.uid, shifts.shiftSlug);
  
//             this.isUniqueSlug = isShiftSlugUnique;
  
//             if (isShiftSlugUnique) {
//               const shiftStartTimeInput = shifts.shiftStartTime;
//               const shiftStartTimeParts = shiftStartTimeInput.split(':');
//               if (shiftStartTimeParts.length === 2) {
//                 const hours = parseInt(shiftStartTimeParts[0], 10);
//                 const minutes = parseInt(shiftStartTimeParts[1], 10);
//                 if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
//                   startShift = hours;
//                 }
//               }
//               const shiftEndTimeInput = shifts.shiftEndTime;
//               const shiftEndTimeParts = shiftEndTimeInput.split(':');
//               if (shiftEndTimeParts.length === 2) {
//                 const hours = parseInt(shiftEndTimeParts[0], 10);
//                 const minutes = parseInt(shiftEndTimeParts[1], 10);
//                 if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
//                   endShift = hours;
//                 }
//               }
  
//               const hourlyWage = parseFloat(shifts.hourlyWage);
//               const dailyPay = (endShift - startShift) * hourlyWage;
  
//               shifts.dailyPay = dailyPay;
  
//               const userId = user.uid;
//               const userDocRef = doc(this.fire, 'users', userId);
//               await updateDoc(userDocRef, {
//                 shifts: arrayUnion(shifts)
//               });
  
//               observer.next();
//               observer.complete();
//             } else {
//               observer.error('ShiftSlug is not unique');
//             }
//           }
//         } catch (err) {
//           console.log('Can not add shift!', err);
//         }
//       });
//     });
//   }
  

//   async isShiftSlugUnique(userId: string, shiftSlug: string): Promise<boolean> {
//     try {
//       const userDocRef = doc(this.fire, 'users', userId);
//       const userDocSnap = await getDoc(userDocRef);

//       if (!userDocSnap.exists()) {
//         return true;
//       }

//       const userData = userDocSnap.data();
//       const userShifts = userData['shifts'] || [];

//       const isUnique = userShifts.every(
//         (userShift: any) => userShift.shiftSlug !== shiftSlug
//       );
//       return isUnique;
//     } catch (err) {
//       console.log('Error checking shiftSlug uniqueness:', err);
//       return false;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import { Firestore, arrayUnion, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import { Observable, Observer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddShiftsService {
  constructor(private fire: Firestore) {}

  isUniqueSlug: boolean = false;

  async addNewShift(shifts: any) {
    const auth = getAuth();
    let startShift: number;
    let endShift: number;

    try {
      const user = await auth.currentUser;

      if (!user) {
        throw new Error('No user is authenticated');
      }

      const isShiftSlugUnique = await this.isShiftSlugUnique(user.uid, shifts.shiftSlug);

      this.isUniqueSlug = isShiftSlugUnique;

      if (isShiftSlugUnique) {
        const shiftStartTimeInput = shifts.shiftStartTime;
        const shiftStartTimeParts = shiftStartTimeInput.split(':');
        if (shiftStartTimeParts.length === 2) {
          const hours = parseInt(shiftStartTimeParts[0], 10);
          const minutes = parseInt(shiftStartTimeParts[1], 10);
          if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            startShift = hours;
          }
        }
        const shiftEndTimeInput = shifts.shiftEndTime;
        const shiftEndTimeParts = shiftEndTimeInput.split(':');
        if (shiftEndTimeParts.length === 2) {
          const hours = parseInt(shiftEndTimeParts[0], 10);
          const minutes = parseInt(shiftEndTimeParts[1], 10);
          if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
            endShift = hours;
          }
        }

        const hourlyWage = parseFloat(shifts.hourlyWage);
        const dailyPay = (endShift - startShift) * hourlyWage;

        shifts.dailyPay = dailyPay;

        const userId = user.uid;
        const userDocRef = doc(this.fire, 'users', userId);
        await updateDoc(userDocRef, {
          shifts: arrayUnion(shifts)
        });

        return true;
      } else {
        this.isUniqueSlug = false;
        throw new Error('ShiftSlug is not unique');
      }
    } catch (err) {
      console.log('Cannot add shift!', err);
      throw err;
    }
  }

  async isShiftSlugUnique(userId: string, shiftSlug: string): Promise<boolean> {
    try {
      const userDocRef = doc(this.fire, 'users', userId);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        return true;
      }

      const userData = userDocSnap.data();
      const userShifts = userData['shifts'] || [];

      const isUnique = userShifts.every(
        (userShift: any) => userShift.shiftSlug !== shiftSlug
      );
      return isUnique;
    } catch (err) {
      console.log('Error checking shiftSlug uniqueness:', err);
      return false;
    }
  }
}
