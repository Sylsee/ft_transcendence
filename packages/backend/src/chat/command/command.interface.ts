// Local imports
import { UserEntity } from 'src/user/entities/user.entity';
import { ChannelEntity } from '../entities/channel.entity';

// This is the base class for all commands
export interface Command {
  /**
   * The method that is called when a command is executed
   *
   * @param sender The user who sent the command
   * @param channel The channel in which the command was sent
   * @param arg The argument of the command
   *
   * @returns A string if an error occurred, void otherwise
   */
  execute(
    sender: UserEntity,
    channel: ChannelEntity,
    arg: string,
  ): Promise<void>;
}
