// src/states/dto/create-state.dto.ts
import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';
import { PoliticalStatus } from '../entities/state.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  capital: string;

  @ApiProperty()
  @IsNumber()
  population: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  abbreviation: string;

  @ApiProperty({ enum: PoliticalStatus })
  @IsEnum(PoliticalStatus)
  political_status: PoliticalStatus;
}
