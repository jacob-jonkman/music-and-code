import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'music-and-code';
  participants$: Observable<any>;

  constructor(private afs: AngularFirestore) {
    this.participants$ = this.afs.collection<any>('participants').valueChanges();
  }
}
