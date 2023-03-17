import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: '',
  })
  description: string;
}

/*
import { ApplicationComponent } from 'src/application-components/entities/application-component.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;

  @Column({
    nullable: false,
    default: '',
  })
  name: string;

  @Column({
    nullable: false,
    default: '',
  })
  description: string;

  // @OneToMany(
  //   () => ApplicationComponent,
  //   (applicationComponent) => applicationComponent.product,
  //   {cascade: true}
  // )
  @ManyToMany(
    () => ApplicationComponent,
    (applicationComponent) => applicationComponent.products,
    { cascade: true },
  )
  @JoinTable()
  componentIds: ApplicationComponent[];
}
*/
