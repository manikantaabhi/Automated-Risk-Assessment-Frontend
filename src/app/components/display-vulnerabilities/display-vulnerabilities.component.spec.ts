import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayVulnerabilitiesComponent } from './display-vulnerabilities.component';

describe('DisplayVulnerabilitiesComponent', () => {
  let component: DisplayVulnerabilitiesComponent;
  let fixture: ComponentFixture<DisplayVulnerabilitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplayVulnerabilitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplayVulnerabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
