import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('strings')
export class String {
  @PrimaryColumn({ type: 'varchar' })
  id: string; 

  @Column({ type: 'text', unique: true })
  value: string;

  @Column({ type: 'integer' })
  length: number;

  @Column({ type: 'boolean' })
  is_palindrome: boolean;

  @Column({ type: 'integer' })
  unique_characters: number;

  @Column({ type: 'integer' })
  word_count: number;

  @Column({ type: 'jsonb' })
  character_frequency_map: Record<string, number>;

  @CreateDateColumn()
  created_at: Date;
}
