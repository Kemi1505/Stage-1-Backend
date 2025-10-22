import { IsNotEmpty, IsString } from 'class-validator';

export class StringDto {
  @IsNotEmpty({message: 'Provide a string'})
  value: string;
}
