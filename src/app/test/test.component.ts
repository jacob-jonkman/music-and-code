import { Component } from '@angular/core';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from './test-step/test-step.component';
import { Observable } from 'rxjs';
import { map, first, shareReplay } from 'rxjs/operators';
import { CodeService } from '../../services/code.service';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  assignmentNumber = 0;
  listeningToMusic$: Observable<boolean>;
  assignments$: Observable<Assignment[]>;
  code: string;
  started = false;
  finished = false;
  numCodes: number;
  participant$: Observable<Participant>;
  participantId$: Promise<string>;

  constructor(private assignmentService: AssignmentService,
              private codeService: CodeService,
              private participantService: ParticipantService,
              private afs: AngularFirestore) {
    this.assignments$ = this.assignmentService.assignments$;
    this.code = this.codeService.getCode(this.assignmentNumber);
    this.numCodes = this.codeService.numberOfCodes;
    this.participant$ = this.participantService.participant$;
    
    this.listeningToMusic$ = this.afs.collection(`params`).valueChanges().pipe(
      first(),
      map(params => params[0]['ßmusic']),
      shareReplay(1)
    );
  }

  beginTest(listeningToMusic: boolean): void {
    this.started = true;
    this.participantId$ = this.participantService.newParticipant(listeningToMusic);
  }

  changeAssignment(nextAssignment: number): any {
    const numCodes = this.codeService.numberOfCodes;
    if (nextAssignment === numCodes) {
      this.finished = true;
      this.participantService.finishedParticipant();
    } else {
      this.assignmentNumber = nextAssignment;
      this.code = this.codeService.getCode(this.assignmentNumber);
    }
  }
}
