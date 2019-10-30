import { Component } from '@angular/core';
import { AssignmentService } from '../../services/assignment.service';
import { Assignment } from './test-step/test-step.component';
import { Observable } from 'rxjs';
import { CodeService } from '../../services/code.service';
import { ParticipantService } from '../../services/participant.service';
import { Participant } from '../../models/participant';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  assignmentNumber = 0;
  listeningToMusic = false;
  assignments$: Observable<Assignment[]>;
  code: string;
  started = false;
  finished = false;
  numCodes: number;
  participant$: Observable<Participant>;
  participantId$: Promise<string>;

  constructor(private assignmentService: AssignmentService,
              private codeService: CodeService,
              private participantService: ParticipantService) {
    this.assignments$ = this.assignmentService.assignments$;
    this.code = this.codeService.getCode(this.assignmentNumber);
    this.numCodes = this.codeService.numberOfCodes;
    this.participant$ = this.participantService.participant$;
  }

  beginTest(): void {
    this.started = true;
    this.participantId$ = this.participantService.newParticipant(this.listeningToMusic);
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
