import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { ProjectService } from '../../services/project';
import { TeamAccessService } from '../../services/team-access.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SidebarService } from '../../../../core/services/sidebar.service';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';
import { AssignUserComponent } from '../assign-user/assign-user.component';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { Team } from '../../models/team.model';
import { TeamMember } from '../../models/team-access.model';
import { AppHttpError } from '../../../../core/models/app-http-error.model';

@Component({
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent, AssignUserComponent, IconComponent, RouterOutlet],
  templateUrl: './team-detail.component.html',
  styleUrls: ['./team-detail.component.css']
})
export class TeamDetailComponent implements OnInit {

  @ViewChild('deleteTeamModal') deleteTeamModal!: ConfirmModalComponent;
  @ViewChild('removeMemberModal') removeMemberModal!: ConfirmModalComponent;

  team!: Team;
  members: TeamMember[] = [];
  isLead = false;
  isMember = false;
  showAddMember = false;
  showMembersSection = false;

  projectId!: number;
  teamId!: number;
  memberToRemove: TeamMember | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private service: ProjectService,
    private teamAccessService: TeamAccessService,
    private authService: AuthService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.isLead = this.authService.isLead();
    this.isMember = this.authService.isMember();

    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('id'));
      this.teamId = Number(params.get('teamId'));
      this.showAddMember = false;
      this.loadTeam();
      this.loadMembers();
    });
  }

  loadTeam(): void {
    this.service.getTeamById(this.teamId).subscribe(res => {
      this.team = res;
    });
  }

  loadMembers(): void {
    this.teamAccessService.getTeamMembers(this.teamId).subscribe(res => {
      this.members = res;
    });
  }

  editTeam(): void {
    this.router.navigate(['/projects', this.projectId, 'teams', this.teamId, 'edit']);
  }

  confirmDeleteTeam(): void {
    this.deleteTeamModal.open();
  }

  onDeleteTeamConfirmed(): void {
    this.service.deleteTeam(this.teamId, { teamId: this.teamId, rowVersion: this.team.rowVersion }).subscribe({
      next: () => {
        const user = this.authService.getCurrentUser();
        if (user) this.sidebarService.refresh(user.userId);
        this.router.navigate(['/projects', this.projectId]);
      },
      error: (err: AppHttpError) => {
        if (err.isConcurrencyError) {
          alert('This record was updated by someone else. Please refresh and try again.');
        }
      }
    });
  }

  toggleAddMember(): void {
    this.showAddMember = !this.showAddMember;
  }

  toggleMembersSection(): void{
    this.showMembersSection = !this.showMembersSection;
  }

  onMemberAssigned(): void {
    this.showAddMember = false;
    this.loadMembers();
  }

  confirmRemoveMember(member: TeamMember): void {
    this.memberToRemove = member;
    this.removeMemberModal.open();
  }

  onRemoveMemberConfirmed(): void {
    if (!this.memberToRemove) return;

    this.teamAccessService.removeMember(this.memberToRemove.accessId, {
      accessId: this.memberToRemove.accessId,
      rowVersion: this.memberToRemove.rowVersion
    }).subscribe({
      next: () => {
        this.memberToRemove = null;
        this.loadMembers();
      },
      error: (err: AppHttpError) => {
        if (err.isConcurrencyError) {
          alert('This record was updated by someone else. Please refresh and try again.');
        }
      }
    });
  }
}
