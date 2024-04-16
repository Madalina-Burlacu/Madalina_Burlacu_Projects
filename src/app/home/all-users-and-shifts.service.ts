import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { getAuth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AllUsersAndShiftsService {
  constructor(private fire: Firestore, private http: HttpClient) {}

  async getAllUsersAndShifts() {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            return;
          } else {
            const userUid = user.uid;
            const userDocRef = doc(this.fire, 'users', userUid);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            if (userData['isAdmin']) {
              const userCollection = collection(this.fire, 'users');
              const usersQuery = query(userCollection);
              const userDocs = getDocs(usersQuery);
              const usersInfo = (await userDocs).docs
                .filter((document) => document.id !== userUid)
                .map((document) => ({
                  ...document.data(),
                  uid: document.id,
                }));
              observer.next(usersInfo);
            } else {
              return;
            }
          }
        } catch (err) {
          observer.error(err);
        }
      });
    });
  }

  async deleteUser(userUidToDelete: string) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            return;
          } else {
            const userDocRef = doc(this.fire, 'users', user.uid);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();
            if (!userData['isAdmin']) {
              return;
            }
            this.http
              .get(
                `https://deleteuser-ofzhwo6sva-uc.a.run.app?userId=${userUidToDelete}`
              )
              .toPromise()
              .then((deletedUserResponde) => {
                console.log(deletedUserResponde);
              });
            const userDocToDelete = doc(this.fire, 'users', userUidToDelete);
            deleteDoc(userDocToDelete);

            const usersCollection = collection(this.fire, 'users');
            const allUsers = getDocs(usersCollection);
            const remainingUsers = (await allUsers).docs
              .filter((el) => el.id !== user.uid)
              .map((el) => ({
                uid: el.id,
                ...el.data(),
              }));
            observer.next(remainingUsers);
          }
        } catch (err) {
          observer.error(err);
        }
      });
    });
  }

  async getUserByUidIfAdmin(uidUser: any) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            return;
          } else {
            const userDocRef = doc(this.fire, 'users', user.uid);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();

            if (!userData['isAdmin']) {
              return;
            }

            const userDocRecord = doc(this.fire, 'users', uidUser);
            const userDocument = getDoc(userDocRecord);
            const userDataRecord = (await userDocument).data();
            observer.next(userDataRecord);
          }
        } catch (err) {
          observer.error(err);
        }
      });
    });
  }

  async updateProfileUserIfAdmin(uidUser: any, updatedData: any) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            return;
          } else {
            const userDocRef = doc(this.fire, 'users', user.uid);
            const userDoc = getDoc(userDocRef);
            const userData = (await userDoc).data();

            if (!userData['isAdmin']) {
              return;
            }

            const url = `https://updateuser-ofzhwo6sva-uc.a.run.app/updateUser?uid=${uidUser}`;
            const body = { uid: uidUser, ...updatedData };

            this.http.post(url, body).subscribe((response: any) => {
              const userDocToUpdate = doc(this.fire, 'users', uidUser);
              const updatedUserData = { ...updatedData };
              updateDoc(userDocToUpdate, updatedUserData);
              observer.next(updatedUserData);
            });
          }
        } catch (err) {
          observer.error(err);
        }
      });
    });
  }

  async deleteShiftUserIfAdmin(userUid: string, shiftSlug: string) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            return;
          }

          const userDocRef = doc(this.fire, 'users', user.uid);
          const userDoc = getDoc(userDocRef);
          const userData = (await userDoc).data();

          if (!userData['isAdmin']) {
            return;
          }

          const userRecordRef = doc(this.fire, 'users', userUid);
          const userRecord = getDoc(userRecordRef);
          const userDataRecord = (await userRecord).data();

          if (userDataRecord['shifts']) {
            const shiftIndex = userDataRecord['shifts'].findIndex(
              (shift: { shiftSlug: string; }) => shift.shiftSlug === shiftSlug
            );

            if (shiftIndex !== -1) {
              userDataRecord['shifts'].splice(shiftIndex, 1);
            }
          }

          updateDoc(userRecordRef, {
            shifts: userDataRecord['shifts'],
          });

          const usersCollection = collection(this.fire, 'users');
          const userQuery = query(usersCollection);
          const userDocs = getDocs(userQuery);
          const usersInfo = (await userDocs).docs
            .filter((document) => document.id !== user.uid)
            .map((document) => ({
              ...document.data(),
              uid: document.id,
            }));

          observer.next(usersInfo);
        } catch (err) {
          observer.error(err);
        }
      });
    });
  }

  async getShiftByIdIfAdmin(uidUser: any, shiftSlug: any) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            observer.next(null);
            return;
          }
  
          const userDocRef = doc(this.fire, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          const userData = userDoc.data();
  
          if (!userData || !userData['isAdmin']) {
            observer.next(null);
            return;
          }
  
          const userRecordRef = doc(this.fire, 'users', uidUser);
          const userRecord = await getDoc(userRecordRef);
          const userDataRecord = userRecord.data();
  
          if (!userDataRecord || !userDataRecord['shifts']) {
            observer.next(null);
            return;
          }
  
          const shiftToFind = userDataRecord['shifts'].find(
            (shift: { shiftSlug: any; }) => shift.shiftSlug === shiftSlug
          );
  
          if (shiftToFind) {
            observer.next(shiftToFind);
          } else {
            observer.next(null);
          }
        } catch (err) {
          observer.error(err);
          observer.next(null);
        }
      });
    });
  }
  

  async updateShiftIfAdmin(
    userUid: string,
    shiftSlug: string,
    updatedData: any
  ) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            return;
          }

          const userDocRef = doc(this.fire, 'users', user.uid);
          const userDoc = getDoc(userDocRef);
          const userData = (await userDoc).data();

          if (!userData['isAdmin']) {
            return;
          }

          const usersCollection = collection(this.fire, 'users');
          const userQuery = query(usersCollection);
          const userDocs = await getDocs(userQuery);
          const usersInfo = userDocs.docs
            .filter((document) => document.id === userUid)
            .map((document) => ({
              ...document.data(),
              uid: document.id,
            }));

          for (const regularUser of usersInfo) {
            if (regularUser['shifts']) {
              const shiftIndex = regularUser['shifts'].findIndex(
                (shift: { shiftSlug: string; }) => shift.shiftSlug === shiftSlug
              );
              if (shiftIndex !== -1) {
                regularUser['shifts'][shiftIndex] = {
                  ...regularUser['shifts'][shiftIndex],
                  ...updatedData,
                };

                const userDocRef = doc(this.fire, 'users', regularUser.uid);
                updateDoc(userDocRef, {
                  shifts: regularUser['shifts'],
                });

              }
            }
          }
          observer.next(usersInfo);
        } catch (err) {
          observer.error(err);
        }
      });
    });
  }

  calculateDayliPay(
    hourlyWage: number,
    startShift: number,
    endShift: number
  ): number {
    return (endShift - startShift) * hourlyWage;
  }

  async getShiftsByWorkplaceIfAdmin(workplace: string) {
    const auth = getAuth();
    return new Observable((observer) => {
      auth.onAuthStateChanged(async (user) => {
        try {
          if (!user) {
            return;
          }
          const userDocRef = doc(this.fire, 'users', user.uid);
          const userDoc = getDoc(userDocRef);
          const userData = (await userDoc).data();
          if (!userData['isAdmin']) {
            return;
          }
          const usersCollection = collection(this.fire, 'users');
          const userQuery = query(usersCollection);
          const userDocs = await getDocs(userQuery);
          const usersInfo = userDocs.docs
            .filter((document) => document.id !== user.uid)
            .map((document) => ({
              ...document.data(),
              uid: document.id,
            }));
          const matchingShifts = [];

          for (const regularUser of usersInfo) {
            if (regularUser['shifts']) {
              const shifts = regularUser['shifts'].filter(
                (shift: { workplace: string | string[] }) => {
                  return shift.workplace.includes(workplace);
                }
              );

              if (shifts.length > 0) {
                const userId = regularUser.uid;
                const lName = regularUser['lName'];
                const fName = regularUser['fName'];
                const matchingUserShifts = { userId, lName, fName, shifts };
                matchingShifts.push(matchingUserShifts);
              }
            }
          }

          observer.next(matchingShifts);
        } catch (err) {
          observer.error(err);
        }
      });
    });
  }

  getShiftsByDate(startDate: Date, endDate: Date): Observable<any> {
    return new Observable((observer) => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        observer.next([]);
        observer.complete();
        return;
      }

      const userDocRef = doc(this.fire, 'users', user.uid);
      getDoc(userDocRef)
        .then((userDoc) => {
          const userData = userDoc.data();
          if (!userData || !userData['isAdmin']) {
            observer.next([]);
            observer.complete();
            return;
          }

          const usersCollection = collection(this.fire, 'users');
          const userQuery = query(usersCollection);
          getDocs(userQuery)
            .then((userDocs) => {
              const usersInfo = userDocs.docs
                .filter((document) => document.id !== user.uid)
                .map((document) => ({
                  ...document.data(),
                  uid: document.id,
                }));

              const matchingShifts = [];

              for (const regularUser of usersInfo) {
                if (regularUser['shifts']) {
                  const shifts = regularUser['shifts'].filter((shift: any) => {
                    const shiftDate = new Date(shift.shiftDate);
                    return (
                      !isNaN(shiftDate.getTime()) &&
                      shiftDate >= startDate &&
                      shiftDate <= endDate
                    );
                  });

                  if (shifts.length > 0) {
                    const userId = regularUser.uid;
                    const lName = regularUser['lName'];
                    const fName = regularUser['fName'];
                    const matchingUserShifts = { userId, lName, fName, shifts };
                    matchingShifts.push(matchingUserShifts);
                  }
                }
              }

              observer.next(matchingShifts);
              observer.complete();
            })
            .catch((error) => {
              observer.error(error);
            });
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
