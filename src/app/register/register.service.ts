import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, getAuth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private fire: Firestore) {}

  async emailExist(email: string):Promise<boolean>{
    const usersCollection = collection(this.fire, 'users');
    const emailQuery = query(usersCollection, where('email', '==', email))
    const emailDocs = await getDocs(emailQuery);
    return emailDocs.size > 0;
  }

  async usernameExist(username: string):Promise<boolean>{
    const usersCollection = collection(this.fire, 'users');
    const usernameQuery = query(usersCollection, where('username', '==', username))
    const userameDocs = await getDocs(usernameQuery);
    return userameDocs.size > 0;
  }

  async addUser(
    fName: string,
    lName: string,
    age: string,
    isAdmin: boolean,
    username: string,
    email: string,
    password: string,
    shifts: any
  ) {
    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userUid = userCredential.user.uid;
      const userDocRef = doc(this.fire, 'users', userUid);
      await setDoc(userDocRef, {
        fName,
        lName,
        age,
        isAdmin,
        username,
        email,
        password,
        shifts,
        uid: userUid
      });
    } catch (err) {
      console.log(`Can't create user.`, err);
    }
  }
}
