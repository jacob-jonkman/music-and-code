import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map, tap, switchMap, reduce } from 'rxjs/operators';
import { ParticipantService } from '../../services/participant.service';

interface Answer {
  answer: string;
  assignmentNumber: number;
  secondsSpent: number;
}

interface Answers {
  answers?: Answer[];
  id?: string;
}

interface Time {
  totalTime: number;
  id: string;
}

interface Accuracy {
  numCorrect: number;
  id: string;
}

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.css']
})
export class AnalysisComponent implements OnInit {
  allAnswers$: Observable<Answers[]>;
  allTimes$: Observable<Time[]>;
  correctAnswers$: Observable<Accuracy[]>;
  combinedStats$: Observable<{id: string, totalTime: number, numCorrect: number}[]>;

  // Visual but unimportant //
  answersMusic$: Observable<Answer[][]>;
  answersNoMusic$: Observable<Answer[][]>;

  timesMusic$: Observable<number[]>;
  timesNoMusic$: Observable<number[]>;

  meanTimeMusic$: Observable<number>;
  meanTimeNoMusic$: Observable<number>;
  // //

  constructor(private afs: AngularFirestore, private participantService: ParticipantService) {
    this.allAnswers$ = this.participantService.getAllAnswers();
    this.allTimes$ = this.allAnswers$.pipe(
      first(allAnswers => !!allAnswers),
      map((allAnswers: Answers[]) => {
        return this.getAllTimes(allAnswers);
      })
    );
    this.correctAnswers$ = this.allAnswers$.pipe(
      first(allAnswers => !!allAnswers),
      map((allAnswers: Answers[]) => {
        return this.getAccuracies(allAnswers);
      })
    );
    this.combinedStats$ = combineLatest(this.allTimes$, this.correctAnswers$).pipe(
      map(([times, correctAnswers]) => {
        return times.map((time, index) => {
          if (time.id !== correctAnswers[index].id) {
            throwError('IDs not equal');
          }
          return {...time, numCorrect: correctAnswers[index].numCorrect};
        });
      }),
    );

    // Visual but unimportant //
    this.answersMusic$ = this.participantService.getAnswers('music');
    this.answersNoMusic$ = this.participantService.getAnswers('noMusic');

    this.timesMusic$ = this.getTimes(this.answersMusic$);
    this.timesNoMusic$ = this.getTimes(this.answersNoMusic$);

    this.meanTimeMusic$ = this.getMeanTime(this.timesMusic$);
    this.meanTimeNoMusic$ = this.getMeanTime(this.timesNoMusic$);
    // //
  }

  ngOnInit() {
  }

  ConvertToCSV(objArray, headerList) {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';

    for (const index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = (i + 1) + '';
      for (const index in headerList) {
        const head = headerList[index];

        line += ',' + array[i][head];
      }
      str += line + '\r\n';
    }
    return str;
  }

  downloadFile(data, filename= 'data') {
    const csvData = this.ConvertToCSV(data, ['id', 'totalTime', 'numCorrect']);
    const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    const dwldLink = document.createElement('a');
    const url = URL.createObjectURL(blob);
    const isSafariBrowser = navigator.userAgent.indexOf('Safari') !== -1 && navigator.userAgent.indexOf('Chrome') === -1;
    if (isSafariBrowser) {  // if Safari open in new window to save file with random filename.
      dwldLink.setAttribute('target', '_blank');
    }
    dwldLink.setAttribute('href', url);
    dwldLink.setAttribute('download', filename + '.csv');
    dwldLink.style.visibility = 'hidden';
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  getAccuracies(allAnswers: Answers[]): Accuracy[] {
    return allAnswers.map(answers => {
      const numCorrect = answers.answers.map((answer, index) => {
        switch (index) {
          case 0:
            return answer.answer === '3';
          case 1:
            return answer.answer === 'adbecf';
          case 2:
            return answer.answer === 'true';
          case 3:
            return answer.answer === '1';
          case 4:
            return answer.answer === 'false';
          case 5:
            return answer.answer === '3';
        }
      }).filter(answerCorrect => answerCorrect === true).length;
      return {id: answers.id, numCorrect};
    });
  }

  getAllTimes(allAnswers: Answers[]): Time[] {
    return allAnswers.map(answers => {
      const totalTime = answers.answers.reduce((sum, answer) => sum + answer.secondsSpent, 0);
      return {id: answers.id, totalTime};
    });
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
    );
  }

  getMeanTime(times$: Observable<number[]>): Observable<number> {
    return times$.pipe(
      map(times => times.reduce((time, sum) => sum + time, 0)),
    );
  }

}
