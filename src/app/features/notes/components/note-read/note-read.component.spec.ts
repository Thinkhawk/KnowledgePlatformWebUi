import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoteReadComponent } from './note-read.component';

describe('NoteReadComponent', () => {
  let component: NoteReadComponent;
  let fixture: ComponentFixture<NoteReadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoteReadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoteReadComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
