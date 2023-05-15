import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class CreateContentDto {
  @IsString()
  @IsNotEmpty()
  banner: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 40)
  title: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 255)
  description: string;

  @IsString()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  author: string;

  @IsBoolean()
  isPublic: boolean;

  @IsArray()
  @Length(1)
  tags: string[];
}
