import { Component, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';
import { UserReadModel } from '../../../../core/models/auth.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  loading = signal<boolean>(false);
  error?: string;
  users = signal<UserReadModel[]>([])
  view: 'team' | 'lead' | 'admin' = 'team';
  editingUsername = signal<string | null>(null);
  newRole = signal<string>('');
  availableRoles = ['ProjectAdmin', 'ProjectLead', 'TeamMember'];
  isSeededAdmin = signal<boolean>(false);

  constructor(
    private auth: AuthService,
    private location: Location) { }

  ngOnInit(): void {
    this.isSeededAdmin.set(this.auth.isSeededAdmin());
    this.loadTeamMembers();
  }

  startEdit(u: UserReadModel) {
    if (!this.isSeededAdmin()) return;
    if (u.username.toLowerCase() === 'admin' || u.email.toLowerCase() === 'admin@test.com') return;
    this.editingUsername.set(u.username);
    this.newRole.set(u.roles.length ? u.roles[0] : this.availableRoles[0]);
  }

  cancelEdit() {
    this.editingUsername.set(null);
  }

  saveRole(u: UserReadModel, selectedRole?: string) {
    const username = u.username;
    // derive oldRole from the current user roles (first entry) to keep behavior
    const oldRole = u.roles.length ? u.roles[0] : '';
    // prefer the explicit selected value if provided (avoids select binding issues), otherwise fall back to signal
    const newRole = (selectedRole ?? this.newRole()).toString();
    if (!newRole) { this.cancelEdit(); return; }
    this.loading.set(true);
    this.auth.changeUserRole({ username, oldRole, newRole }).subscribe({
      next: res => {
        // update local user roles from response
        if (res && res.Roles) {
          const list = this.users();
          const idx = list.findIndex(x => x.username === username);
          if (idx >= 0) {
            list[idx] = { ...list[idx], roles: res.Roles };
            this.users.set(list);
          }
        }
        // refresh current view to reflect role-specific lists
        if (this.view === 'team') this.loadTeamMembers();
        else if (this.view === 'lead') this.loadProjectLeads();
        else this.loadProjectAdmins();
        this.loading.set(false);
        this.cancelEdit();
      },
      error: err => { this.error = err?.error ?? err?.message ?? 'Change role failed'; this.loading.set(false); }
    });
  }

  loadTeamMembers() {
    this.loading.set(true);
    this.error = undefined;
    this.view = 'team';
    this.auth.getTeamMembers().subscribe({
      next: res => { this.users.set(res); this.loading.set(false); },
      error: err => { this.error = err?.error ?? err?.message ?? 'Failed to load team members'; this.loading.set(false); }
    });
  }

  loadProjectLeads() {
    this.loading.set(true);
    this.error = undefined;
    this.view = 'lead';
    this.auth.getProjectLeads().subscribe({
      next: res => { this.users.set(res); this.loading.set(false); },
      error: err => { this.error = err?.error ?? err?.message ?? 'Failed to load project leads'; this.loading.set(false); }
    });
  }

  loadProjectAdmins() {
    this.loading.set(true);
    this.error = undefined;
    this.view = 'admin';
    this.auth.getProjectAdmins().subscribe({
      next: res => { this.users.set(res); this.loading.set(false); },
      error: err => { this.error = err?.error ?? err?.message ?? 'Failed to load project admins'; this.loading.set(false); }
    });
  }

  deleteUser(username: string) {
    if (!confirm(`Delete user ${username}?`)) return;
    this.loading.set(true);
    this.auth.deleteUser(username).subscribe({
      next: res => {
        // refresh list
        // refresh list
        if (this.view === 'team') this.loadTeamMembers();
        else if (this.view === 'lead') this.loadProjectLeads();
        else this.loadProjectAdmins();
        this.loading.set(false);
      },
      error: err => { this.error = err?.error ?? err?.message ?? 'Delete failed'; this.loading.set(false); }
    });
  }

  onCancel() {
    this.location.back();
  }
}
