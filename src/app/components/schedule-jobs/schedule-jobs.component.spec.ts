import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleJobsComponent } from './schedule-jobs.component';

describe('ScheduleJobsComponent', () => {
  let component: ScheduleJobsComponent;
  let fixture: ComponentFixture<ScheduleJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleJobsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
