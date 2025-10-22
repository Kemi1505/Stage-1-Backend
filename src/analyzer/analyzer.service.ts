import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { String } from './string.entity';
import { Repository } from 'typeorm';
import { createHash } from 'crypto';
import { StringDto } from './string.dto';

@Injectable()
export class AnalyzerService {
    constructor(
        @InjectRepository(String)
        private readonly stringRepository: Repository<String>
    ){}

    getSha256(value: string){
        const hash = createHash('sha256')
        hash.update(value)
        return hash.digest('hex')
    }

    getProperties(value: string){
        const palindrome = value.trim().toLowerCase();
        const reversedString = palindrome.split('').reverse().join('');
        const is_palindrome = palindrome === reversedString
        const length = value.length;
        const charFrequency: Record<string, number> = {};
        for (const char of value) {
            charFrequency[char] = (charFrequency[char] || 0) + 1;
        }
        const unique_char = new Set(value.replace(/\s+/g, ''));
        const unique_characters = unique_char.size;
        const word_count = value.trim().length === 0 ? 
        0 : value.trim().split(/\s+/).length;
        const sha256_hash = this.getSha256(value);

        return {
        length,
        is_palindrome,
        unique_characters,
        word_count,
        sha256_hash,
        character_frequency_map: charFrequency,
        };
    }
    async create(stringDto: StringDto) {
    const properties = this.getProperties(stringDto.value);
    const id = properties.sha256_hash;

    const existingString = await this.stringRepository.findOneBy({ id });
    if (existingString){
        throw new ConflictException('String already exists');
    }

    const stringData = this.stringRepository.create({
      id,
      value: stringDto.value,
      length: properties.length,
      is_palindrome: properties.is_palindrome,
      unique_characters: properties.unique_characters,
      word_count: properties.word_count,
      character_frequency_map: properties.character_frequency_map,
    });

    await this.stringRepository.save(stringData);

    return {
        id,
        value: stringDto.value,
        properties: properties,
        created_at: stringData.created_at.toISOString()
    };
  }

  async findByValue(value: string) {
    const id = this.getSha256(value);
    const properties = this.getProperties(value)
    const stringData = await this.stringRepository.findOneBy({ id });
    if (!stringData) {
        throw new NotFoundException('String not found');
    }
    return {
      id: stringData.id,
      value: stringData.value,
      properties: properties,
      created_at: stringData.created_at.toISOString(),
    };
  }

  async findAll(filters: {
    is_palindrome?: boolean;
    min_length?: number;
    max_length?: number;
    word_count?: number;
    contains_character?: string;
    }) {
    const querry = this.stringRepository.createQueryBuilder('s');

    if (typeof filters.is_palindrome === 'boolean') {
      querry.andWhere(
        's.is_palindrome = :is_palindrome', 
        { is_palindrome: filters.is_palindrome });
    }
    if (typeof filters.min_length === 'number') {
      querry.andWhere(
        's.length >= :min_length', 
        { min_length: filters.min_length });
    }
    if (typeof filters.max_length === 'number') {
      querry.andWhere(
        's.length <= :max_length', 
        { max_length: filters.max_length });
    }
    if (typeof filters.word_count === 'number') {
      querry.andWhere(
        's.word_count = :word_count', 
        { word_count: filters.word_count });
    }
    if (typeof filters.contains_character === 'string') {
      querry.andWhere(
        `(s.character_frequency_map ? :char)`, 
        { char: filters.contains_character });
    }

    const items = await querry.getMany();
    const data = items.map((stringData) => ({
      id: stringData.id,
      value: stringData.value,
      properties: {
        length: stringData.length,
        is_palindrome: stringData.is_palindrome,
        unique_characters: stringData.unique_characters,
        word_count: stringData.word_count,
        sha256_hash: stringData.id,
        character_frequency_map: stringData.character_frequency_map,
      },
      created_at: stringData.created_at.toISOString(),
    }));
    return { 
        data, 
        count: data.length, 
        filters_applied: filters 
    };
  }

  async deleteByValue(value: string) {
    const id = this.getSha256(value);
    const del = await this.stringRepository.delete({ id });
    if (del.affected === 0) {
        throw new NotFoundException('String does not exist');
    }
    return;
  }
}