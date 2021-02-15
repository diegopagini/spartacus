import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filter, first, switchMap, take } from 'rxjs/operators';
import {
  LoadStatus,
  UserGroup,
} from '@spartacus/organization/administration/core';
import { ListService } from '../../shared/list/list.service';
import { CurrentUserGroupService } from '../services/current-user-group.service';
import { UserGroupUserListService } from './user-group-user-list.service';
import { MessageService } from '../../shared/message/services/message.service';

@Component({
  selector: 'cx-org-user-group-user-list',
  templateUrl: './user-group-user-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'content-wrapper' },
  providers: [
    {
      provide: ListService,
      useExisting: UserGroupUserListService,
    },
  ],
})
export class UserGroupUserListComponent {
  constructor(
    protected currentUserGroupService: CurrentUserGroupService,
    protected userGroupUserListService: UserGroupUserListService,
    protected messageService: MessageService
  ) {}

  unassignAll() {
    this.currentUserGroupService.key$
      .pipe(
        first(),
        switchMap((key) =>
          this.userGroupUserListService.unassignAllMembers(key).pipe(
            take(1),
            filter((data) => data.status === LoadStatus.SUCCESS)
          )
        )
      )
      .subscribe((data) => {
        this.notify(data.item);
      });
  }

  protected notify(item: UserGroup) {
    this.messageService.add({
      message: {
        key: `orgUserGroupUsers.unassignAllConfirmation`,
        params: {
          item,
        },
      },
    });
  }
}
