// Third-party imports
import { adjectives, uniqueNamesGenerator } from 'unique-names-generator';

// Local imports
import { UserService } from 'src/user/user.service';

export function formatUserName(name: string): string {
  return name.replace(/ /g, '-').replace(/[^a-zA-Z0-9-_]/g, '');
}

export async function getUniqueName(
  name: string,
  userService: UserService,
): Promise<string> {
  if (!(await userService.findOneByName(name))) {
    return name;
  }

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const randomName = uniqueNamesGenerator({
      dictionaries: [[name], adjectives],
      style: 'capital',
      separator: '-',
      length: 2,
    });
    if (!(await userService.findOneByName(randomName))) {
      return randomName;
    }
  }
}
