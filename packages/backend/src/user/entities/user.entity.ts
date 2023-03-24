// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

// Local files
import { AuthProvider } from '../dto/auth-provider.enum';

@Entity('users')
export class UserEntity {
  @ApiProperty({
    example: '64f52fdb-7621-454f-a35e-524ee2ab3466',
  })
  @IsString()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: '42',
  })
  @IsNotEmpty()
  @Column({
    type: 'enum',
    enum: AuthProvider,
  })
  provider: AuthProvider;

  @ApiProperty({
    example: '123456789',
  })
  @IsNotEmpty()
  @IsString()
  @Column()
  providerId: string;

  @ApiProperty({
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  @Column()
  email: string;

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
  avatarUrl: string;

  @ApiProperty()
  @ManyToMany(() => UserEntity, (user) => user.friends)
  friends: UserEntity[];

  @ApiProperty()
  @ManyToMany(() => UserEntity, (user) => user.friendRequests)
  friendRequests: UserEntity[];

  @ApiProperty()
  @ManyToMany(() => UserEntity, (user) => user.blockedUsers)
  blockedUsers: UserEntity[];
}
