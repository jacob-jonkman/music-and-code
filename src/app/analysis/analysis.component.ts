import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, tap, switchMap, reduce } from 'rxjs/operators';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant';

interface Answer {
  answer: string;
  assignmentNumber: number;
  secondsSpent: number;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  times$: Observable<{music: number[], noMusic: number[]}>;
  answersMusic$: Observable<Answer[][]>;
  answersNoMusic$: Observable<Answer[][]>;
  timesMusic$: Observable<number[]>;
  timesNoMusic$: Observable<number[]>;
  meanTimeMusic$: Observable<number>;
  meanTimeNoMusic$: Observable<number>;

  constructor(private afs: AngularFirestore, private participantService: ParticipantService) {
    this.answersMusic$ = this.participantService.getAllAnswers('music');
    this.answersNoMusic$ = this.participantService.getAllAnswers('noMusic');

    this.timesMusic$ = this.getTimes(this.answersMusic$);
    this.timesNoMusic$ = this.getTimes(this.answersNoMusic$);

    this.meanTimeMusic$ = this.getMeanTime(this.timesMusic$);
    this.meanTimeNoMusic$ = this.getMeanTime(this.timesNoMusic$);

    this.meanTimeMusic$.subscribe();
    this.meanTimeNoMusic$.subscribe();
  }

  ngOnInit() {
  }

  getTimes(answers$: Observable<Answer[][]>): Observable<number[]> {
    return answers$.pipe(
      first(),
      map(allAnswers => {
        return allAnswers
          .map(answers => answers
            .map(answer => answer.secondsSpent)
            .reduce((secondsSpent, sum) => sum + secondsSpent, 0)
          );
      }),
      tap(times => console.log(times))
    );
  }

  getMeanTime(times$: Observable<number[]>): Observable<number> {
    return times$.pipe(
      map(times => times.reduce((time, sum) => sum + time, 0)),
      tap(time => console.log('mean time', time))
    );
  }

}
