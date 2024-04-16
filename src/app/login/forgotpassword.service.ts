import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { user } from '@angular/fire/auth';
import { Firestore, collection, deleteDoc, doc, getDocs, query, where } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ForgotpasswordService {
  userNotFound:boolean = false;
  emailUser:any;

  constructor(private fire: Firestore, private http: HttpClient) { }

  async deleteUserByEmail(email: string): Promise<void>{
    try{
      const usersCollection = collection(this.fire, 'users');
      const emailQuery = query(usersCollection, where('email', '==', email));
      const emailDocs = await getDocs(emailQuery);

      if(!emailDocs.empty){
        const docToDelete = emailDocs.docs[0];
        const userId = docToDelete.id;
        this.http.get(`https://deleteuser-ofzhwo6sva-uc.a.run.app?userId=${userId}`)
        .toPromise()
        .then((deletedUserResponse) =>{
          return deletedUserResponse;
        })
        const docRef = doc(usersCollection, docToDelete.id)
        await deleteDoc(docRef);
      }else{
        this.userNotFound = true;
      }
    }
    catch(err){
      console.log('Eroare la stergerea utilizatorului', err)
    }
  }

  async checkUserValidity(email: string): Promise<boolean> {
    const usersCollection = collection(this.fire, 'users');
    const emailQuery = query(usersCollection, where('email', '==', email));
    const emailDocs = await getDocs(emailQuery);

    if (!emailDocs.empty) {
      const docToDelete = emailDocs.docs[0];
      this.emailUser = docToDelete.data();
      return true;
    } else {
      return false;
    }
  }

}
