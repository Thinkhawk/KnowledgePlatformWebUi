import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { TeamAccessService } from '../../services/team-access.service';
import { UserSearchResult } from '../../models/team-access.model';
import { AppHttpError } from '../../../../core/models/app-http-error.model';

@Component({
  selector: 'app-assign-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit {

  @Input() teamId!: number;
  @Output() memberAssigned = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  accessLevel: 'Read' | 'Write' = 'Read';
  searchControl = new FormControl('');
  suggestions: UserSearchResult[] = [];
  selectedUser: UserSearchResult | null = null;
  assignError: string | null = null;
  isSearching = false;
  showDropdown = false;

  constructor(private teamAccessService: TeamAccessService) { }

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        const t = term?.trim() ?? '';
        if (t.length < 2) { this.suggestions = []; this.showDropdown = false; return of([]); }
        this.isSearching = true;
        return this.teamAccessService.searchUsers(t).pipe(catchError(() => of([])));
      })
    ).subscribe(results => {
      this.suggestions = results;
      this.showDropdown = results.length > 0;
      this.isSearching = false;
    });
  }

  selectUser(user: UserSearchResult): void {
    this.selectedUser = user;
    this.searchControl.setValue(user.email ?? '', { emitEvent: false });
    this.showDropdown = false;
    this.suggestions = [];
    this.assignError = null;
  }

  clearSelection(): void {
    this.selectedUser = null;
    this.searchControl.setValue('');
  }

  assign(): void {
    if (!this.selectedUser) return;
    this.assignError = null;

    this.teamAccessService.assignMember({
      teamId: this.teamId,
      userId: this.selectedUser.userId,
      accessLevel: this.accessLevel === 'Read' ? 0 : 1,
    }).subscribe({
      next: () => {
        this.resetForm();
        this.memberAssigned.emit();
      },
      error: (err: AppHttpError) => {
        if (err.status === 409) {
          this.assignError = 'This user is already a member of this team.';
        } else {
          this.assignError = err.detail ?? 'Failed to assign member.';
        }
      }
    });
  }

  cancel(): void {
    this.resetForm();
    this.cancelled.emit();
  }

  private resetForm(): void {
    this.searchControl.setValue('');
    this.selectedUser = null;
    this.suggestions = [];
    this.showDropdown = false;
    this.assignError = null;
    this.accessLevel = 'Read';
  }
}
