import { ApiProperty } from "@nestjs/swagger";
import { UserRelationship } from "../enum/user-relationship.enum";
import { IsEnum, IsNotEmpty } from "class-validator";


export class UserRelationshipDto {
  @ApiProperty({
    enum: UserRelationship,
    isArray: true,
    description: 'The relationship status between two users',
    example: UserRelationship.friends,
  })
  @IsNotEmpty()
  @IsEnum(UserRelationship)
  status: UserRelationship;
}