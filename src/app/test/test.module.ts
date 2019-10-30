import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { TestComponent } from './test.component';
import { TestStepComponent } from './test-step/test-step.component';
import { HighlightModule } from 'ngx-highlightjs';
import cpp from 'highlight.js/lib/languages/cpp';
import { ReactiveFormsModule } from '@angular/forms';

/**
 * Import every language you wish to highlight here
 * NOTE: The name of each language must match the file name its imported from
 */
export function hljsLanguages() {
  return [
    {name: 'cpp', func: cpp},
  ];
}

const testRoutes: Route[] = [
  {path: '', component: TestComponent}
];

@NgModule({
  declarations: [
    TestComponent,
    TestStepComponent,
  ],
  imports: [
    RouterModule.forRoot(testRoutes, {enableTracing: true}),
    HighlightModule.forRoot({
      languages: hljsLanguages
    }),
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [
    TestComponent,
  ],
  bootstrap: [TestComponent]
})
export class TestModule { }
