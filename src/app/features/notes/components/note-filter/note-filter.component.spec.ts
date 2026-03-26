import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteFilterComponent } from './note-filter.component';

describe('NoteFilterComponent', () => {
  let component: NoteFilterComponent;
  let fixture: ComponentFixture<NoteFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteFilterComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
