// NestJS imports
import { ApiProperty } from '@nestjs/swagger';

// Third-party imports
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';

// Local files
import { AuthProvider } from '../../auth/dto/auth-provider.enum';

@Entity('users')
export class UserEntity {
  @ApiProperty({
    example: '12345678-abcd-1234-abcd-1234567890ab',
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
  @OneToMany(() => UserEntity, (user) => user.friends)
  friends: UserEntity[];

  @ApiProperty()
  @ManyToMany(() => UserEntity, (user) => user.friendRequests)
  friendRequests: UserEntity[];

  @ApiProperty()
  @OneToMany(() => UserEntity, (user) => user.blockedUsers)
  blockedUsers: UserEntity[];
}
