import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Participant } from '../../../models/participant';
import { ParticipantService } from '../../../services/participant.service';

export interface Assignment {
  number: number;
  name: string;
  text: string;
  code: string;
  correctAnswer: string;
  codeFile: string;
}

@Component({
  selector: 'app-test-step',
  templateUrl: './test-step.component.html',
  styleUrls: ['./test-step.component.css']
})
export class TestStepComponent implements OnInit {
  @Input() assignmentNumber: number;
  @Input() assignment: Assignment;
  @Input() numAssignments: number;
  @Input() code: string;
  @Output() nextStep = new EventEmitter();
  assignmentForm: FormGroup;
  beginTime: Date;
  endTime: Date;
  participant$: Observable<Participant>;

  constructor(private formBuilder: FormBuilder,
              private participantService: ParticipantService) {
    this.assignmentForm = this.formBuilder.group({
      answer: ['', Validators.required],
    });
    this.participant$ = this.participantService.participant$;
    this.beginTime = new Date();
  }

  ngOnInit() {
    document.getElementById('answer').focus();
  }

  prev() {
    this.assignmentNumber -= 1;
    this.nextStep.emit(this.assignmentNumber);
  }

  next() {
    this.assignmentForm.markAllAsTouched();
    if (this.assignmentForm.valid) {
      const answer = this.assignmentForm.get('answer').value;
      this.endTime = new Date();
      return this.participantService.addAnswer(this.assignmentNumber, answer, this.beginTime, this.endTime).then(() => {
        this.assignmentNumber += 1;
        this.assignmentForm.reset();
        this.beginTime = new Date();
        this.assignmentForm.markAsUntouched();
        this.nextStep.emit(this.assignmentNumber);
      });
    }
  }

  onKeyPress(event) {
    if (event.keyCode === 13) {
      return this.next();
    }
  }

  hasError() {
    return this.assignmentForm.controls.answer.hasError('required') && this.assignmentForm.controls.answer.touched === true;
  }
}
