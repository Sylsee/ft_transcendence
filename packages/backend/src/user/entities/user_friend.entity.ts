// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

// Local files
import { UserEntity } from './user.entity';

@Entity()
export class UserFriend {
  @ApiProperty({
    example: '12345678-abcd-1234-abcd-1234567890ab',
  })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: `Relation to User entity`
  })
  @ManyToOne(() => UserEntity, {nullable: false})
  @JoinColumn({name: `User`, foreignKeyConstraintName: `FK_UserFriends_UserEntity_User`})
  user: UserEntity;

  @ApiProperty({
    description: `Relation to User entity`
  })
  @ManyToOne(() => UserEntity, {nullable: false})
  @JoinColumn({name: `Friend`, foreignKeyConstraintName: `FK_UserFriends_UserEntity_Friend`})
  friend: UserEntity;
}
