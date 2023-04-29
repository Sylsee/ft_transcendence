// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEnum, IsNotEmpty } from 'class-validator';

// Local imports
import { UserRelationship } from '../../enum/user-relationship.enum';

export class UserRelationshipDto {
  @ApiProperty({
    enum: UserRelationship,
    description: 'The relationship status between two users',
    example: UserRelationship.friends,
    required: true,
  })
  @IsNotEmpty()
  @IsEnum(UserRelationship)
  status: UserRelationship;
}
