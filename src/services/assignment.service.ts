import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Assignment } from '../app/test/test-step/test-step.component';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {
  public assignments$: Observable<Assignment[]>;

  constructor(public afs: AngularFirestore) {
    this.assignments$ = this.afs.collection<Assignment>(`assignments`).valueChanges();
  }
}
