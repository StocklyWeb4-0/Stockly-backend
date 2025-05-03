import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ProductCategory } from '../../productCategories/entities/productCategory.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  code: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  priceDiscount?: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column({ nullable: true })
  idCategory?: number;

  @ManyToOne(() => ProductCategory)
  @JoinColumn({ name: 'idCategory' })
  category?: ProductCategory;

  @Column('text', { nullable: true })
  description?: string;
}
