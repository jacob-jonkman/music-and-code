import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Participant } from '../models/participant';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  participant$: Observable<Participant>;
  idOfParticipant = new BehaviorSubject<string>('');

  constructor(private afs: AngularFirestore) {
    this.participant$ = this.idOfParticipant.pipe(
      first(participantId => participantId !== ''),
      switchMap(participantId => {
        return this.afs.doc<Participant>(`participants/${participantId}`).valueChanges();
      })
    );
  }

  newParticipant(listeningToMusic): Promise<string> {
    return this.afs.collection('participants').add({started: true, music: listeningToMusic, timestamp: new Date()})
      .then(participantRef => {
        this.idOfParticipant.next(participantRef.id);
        return participantRef.id;
      });
  }

  addAnswer(assignment: number, answer: string, beginTime: Date, endTime: Date): Promise<any> {
    const secondsSpent = (endTime.getTime() - beginTime.getTime()) / 1000;
    return this.idOfParticipant.pipe(
      first(),
      map(participantId => {
        return this.afs.doc(`participants/${participantId}/answers/${assignment}`).set({
          answer,
          beginTime,
          endTime,
          secondsSpent,
          assignmentNumber: assignment,
        });
      })
    ).toPromise();
  }

  finishedParticipant() {
    return this.afs.doc(`participants/${this.idOfParticipant.getValue()}`).update({finished: true});
  }
}

