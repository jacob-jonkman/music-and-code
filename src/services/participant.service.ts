import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { Participant } from '../models/participant';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, switchMap, tap, zip } from 'rxjs/operators';
import { Answer } from '../models/answer';

@Injectable({
  providedIn: 'root'
})
export class ParticipantService {
  participant$: Observable<Participant>;
  participants$: Observable<Participant[]>;
  idOfParticipant = new BehaviorSubject<string>('');

  constructor(private afs: AngularFirestore) {
    this.participant$ = this.idOfParticipant.pipe(
      first(participantId => participantId !== ''),
      switchMap(participantId => {
        return this.afs.doc<Participant>(`participants/${participantId}`).valueChanges();
      })
    );
    this.participants$ = this.getAllParticipants();
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

  getAllParticipants(): Observable<Participant[]> {
    return this.afs.collection('participants').snapshotChanges().pipe(
      first(),
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data } as Participant;
        });
      }),
    );
  }

  splitParticipants(): Observable<{music: Participant[], noMusic: Participant[]}> {
    return this.participants$.pipe(
      map((participants: Participant[]) => {
        const filtered = participants.filter((p: Participant) => p.finished);
        const musicListeners = filtered.filter((p: Participant) => p.music === 'true' || p.music === true);
        const nonMusicListeners = filtered.filter((p: Participant) => p.music === 'false' || p.music === false);
        return {
          music: musicListeners,
          noMusic: nonMusicListeners
        };
      }),
    );
  }

  getAllAnswers(condition: 'music' | 'noMusic'): Observable<Answer[][]> {
    return this.splitParticipants().pipe(
      first(),
      switchMap((participants: {music: Participant[], noMusic: Participant[]}) => {
        const observables = participants[condition].map(participant => {
          return this.afs.collection<Answer>(`participants/${participant.id}/answers`).valueChanges();
        });
        return combineLatest(observables);
      }),
      zip(answers => {
        console.log('zipped answers', condition, answers);
        return answers;
      })
    );
  }
}

