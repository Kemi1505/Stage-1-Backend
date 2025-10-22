import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';

export function parseNL(query: string): Record<string, any> {
  if (!query) throw new BadRequestException('query parameter required');

  const decoded = decodeURIComponent(query).toLowerCase().trim();
  const filters: Record<string, any> = {};
  if (decoded.match(/\bpalindrom(e|ic)?\b/)) filters.is_palindrome = true;
  if (decoded.match(/\bnot palindrom(e|ic)?\b/) || decoded.match(/\bnon-palindrom/))
    filters.is_palindrome = false;

  // word counts
  if (decoded.match(/\bsingle word\b/) || decoded.match(/\bone word\b/)) filters.word_count = 1;
  const wc = decoded.match(/\b(\d+)\s*words?\b/);
  if (wc) filters.word_count = Number(wc[1]);

  // "longer than N characters" -> min_length = N + 1
  const longer = decoded.match(/longer than (\d+)\s*characters?/);
  if (longer) filters.min_length = Number(longer[1]) + 1;

  // "shorter than N characters" -> max_length = N - 1
  const shorter = decoded.match(/shorter than (\d+)\s*characters?/);
  if (shorter) filters.max_length = Number(shorter[1]) - 1;

  // "between X and Y characters" -> min_length = X, max_length = Y
  const between = decoded.match(/between (\d+)\s*(?:and|-)\s*(\d+)\s*characters?/);
  if (between) {
    const a = Number(between[1]);
    const b = Number(between[2]);
    filters.min_length = Math.min(a, b);
    filters.max_length = Math.max(a, b);
  }

  // contains letter: z
  const contains =
    decoded.match(/contain(?:s|ing)? (?:the )?letter '?([a-z0-9])'?/) ||
    decoded.match(/contains? '?([a-z0-9])'?/) ||
    decoded.match(/with (?:the )?letter '?([a-z0-9])'?/);
  if (contains) filters.contains_character = contains[1].toLowerCase();

  // simple 'first vowel' heuristic
  if (decoded.includes('first vowel')) filters.contains_character = 'a';
  return filters;
}

export function validateNL(query?: string) {
  if (!query) throw new BadRequestException('query parameter be provided');

  const parsed = parseNL(query);

  if (!parsed || Object.keys(parsed).length === 0) {
    throw new UnprocessableEntityException('Unable to parse query');
  }

  if (
    typeof parsed.min_length === 'number' &&
    typeof parsed.max_length === 'number' &&
    parsed.min_length > parsed.max_length
  ) {
    throw new UnprocessableEntityException('Parsed filters conflict (min_length > max_length)');
  }

  return { decoded: decodeURIComponent(query), parsed };
}