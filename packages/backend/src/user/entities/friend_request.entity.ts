// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

// Local files
import { UserEntity } from './user.entity';

@Entity()
export class FriendRequest {
  @ApiProperty({
    example: '12345678-abcd-1234-abcd-1234567890ab',
  })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: `Shows acceptance of request`
  })
  @Column({nullable: false})
  accepted: boolean

  @ApiProperty({
    description: `Relation to User entity`
  })
  @ManyToOne(() => UserEntity, {nullable: false})
  @JoinColumn({name: `FromUser`, foreignKeyConstraintName: `FK_FromUser_UserEntity`})
  fromUser: UserEntity;

  @ApiProperty({
    description: `Relation to User entity`
  })
  @ManyToOne(() => UserEntity, {nullable: false})
  @JoinColumn({name: `ToUser`, foreignKeyConstraintName: `FK_ToUser_UserEntity`})
  toUser: UserEntity;
}
