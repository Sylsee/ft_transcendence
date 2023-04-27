// Local imports
import { UserEntity } from 'src/user/entities/user.entity';

export function removeUserFromList(
  userList: UserEntity[],
  userId: string,
): void {
  const index = userList.findIndex((user) => user.id === userId);
  if (index !== -1) {
    userList.splice(index, 1);
  }
}

export function userIdInList(list: UserEntity[], userId: string): boolean {
  return list && list.findIndex((user) => user.id === userId) !== -1;
}
