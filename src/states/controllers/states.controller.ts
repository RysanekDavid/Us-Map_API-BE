// src/states/controllers/states.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { StateDetailService } from '../services/state-detail.service';
import { Section } from '../entities/state-detail.entity';
import * as fs from 'fs';
import * as path from 'path';

@ApiTags('states')
@Controller('states')
@UseInterceptors(CacheInterceptor)
export class StatesController {
  constructor(private readonly stateDetailService: StateDetailService) {}

  @Get('export')
  @ApiOperation({ summary: 'Get current JSON data' })
  async getJsonData() {
    try {
      const dataPath = path.join(__dirname, '../../../data/states.json');
      if (!fs.existsSync(dataPath)) {
        throw new NotFoundException('JSON data file not found');
      }

      const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return jsonData;
    } catch (error) {
      throw new HttpException(
        `Failed to read JSON data: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':name/detail')
  @ApiOperation({ summary: 'Get state detail sections' })
  async getStateDetail(@Param('name') name: string) {
    const detail = await this.stateDetailService.getStateDetail(name);
    if (!detail) {
      throw new NotFoundException(`Detail for state ${name} not found`);
    }
    return detail;
  }

  @Post(':name/detail/sections')
  @ApiOperation({ summary: 'Update state detail sections' })
  async updateStateSections(
    @Param('name') name: string,
    @Body() sections: Section[],
  ) {
    const success = await this.stateDetailService.updateStateSections(
      name,
      sections.map((section) => ({
        ...section,
        updated_at: new Date().toISOString(),
      })),
    );
    if (!success) {
      throw new HttpException(
        'Failed to update sections',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return { success: true };
  }

  @Get('statesDetail')
  @ApiOperation({ summary: 'Get statesDetail.json content' })
  async getStateDetailFile() {
    try {
      const filePath = path.join(__dirname, '../../../data/statesDetail.json');
      const content = await fs.promises.readFile(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      throw new HttpException(
        'Failed to read statesDetail.json',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Nový endpoint pro uložení kompletního statesDetail.json
  @Post('updateDetail')
  @ApiOperation({ summary: 'Update whole statesDetail.json' })
  async updateDetailFile(@Body() updateData: any) {
    try {
      const filePath = path.join(__dirname, '../../../data/statesDetail.json');
      await fs.promises.writeFile(
        filePath,
        JSON.stringify(updateData, null, 2),
        'utf8',
      );
      return { success: true };
    } catch (error) {
      console.error('Failed to update state detail:', error);
      throw new HttpException(
        'Failed to update state detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
