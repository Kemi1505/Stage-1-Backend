import { BadRequestException } from '@nestjs/common';

export function validateFilters(query: any) {
  const {
    is_palindrome,
    min_length,
    max_length,
    word_count,
    contains_character,
  } = query;

  const filters: any = {};

  if (is_palindrome !== undefined) {
    if (!['true', 'false'].includes(is_palindrome))
      throw new BadRequestException('is_palindrome must be true or false');
    filters.is_palindrome = is_palindrome === 'true';
  }

  if (min_length !== undefined) {
    const n = Number(min_length);
    if (!Number.isInteger(n) || n < 0)
      throw new BadRequestException('min_length must be a non-negative integer');
    filters.min_length = n;
  }

  if (max_length !== undefined) {
    const n = Number(max_length);
    if (!Number.isInteger(n) || n < 0)
      throw new BadRequestException('max_length must be a non-negative integer');
    filters.max_length = n;
  }

  if (word_count !== undefined) {
    const n = Number(word_count);
    if (!Number.isInteger(n) || n < 0)
      throw new BadRequestException('word_count must be a non-negative integer');
    filters.word_count = n;
  }

  if (contains_character !== undefined) {
    if (contains_character.length !== 1)
      throw new BadRequestException('contains_character must be a single character');
    filters.contains_character = contains_character;
  }

  if (
    filters.min_length !== undefined &&
    filters.max_length !== undefined &&
    filters.min_length > filters.max_length
  ) {
    throw new BadRequestException('min_length cannot be greater than max_length');
  }

  return filters;
}
