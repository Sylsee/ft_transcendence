import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity('users')
export class User {
  @ApiProperty({
    example: '64f52fdb-7621-454f-a35e-524ee2ab3466',
  })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 2337,
  })
  @IsNotEmpty()
  @IsNumber()
  @Column({
    unique: true,
  })
  id42: number;

  @ApiProperty({
    example: 'spoliart',
  })
  @IsNotEmpty()
  @IsString()
  @Column({
    unique: true,
  })
  login: string;

  @ApiProperty({
    example: 'Arnaud',
  })
  @IsNotEmpty()
  @IsString()
  @Column()
  name: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
  })
  @IsNotEmpty()
  @IsString()
  @Column({
    unique: true,
  })
  avatar: string;

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.friends)
  friends: User[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.friendRequests)
  friendRequests: User[];

  @ApiProperty()
  @ManyToMany(() => User, (user) => user.blockedUsers)
  blockedUsers: User[];
}
