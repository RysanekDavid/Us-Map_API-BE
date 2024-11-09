// src/states/states.controller.ts
import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseInterceptors,
  NotFoundException,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { StatesService } from './states.service';
import { State } from './entities/state.entity';
import { StateSection } from './entities/state-section.entity';
import { CreateSectionDto } from './dto/create-section.dto';

@ApiTags('states')
@Controller('states')
@UseInterceptors(CacheInterceptor)
export class StatesController {
  constructor(private readonly statesService: StatesService) {}

  // GET /states - Získá seznam všech států
  @Get()
  @ApiOperation({ summary: 'Get all states' })
  @ApiQuery({ name: 'political_status', required: false })
  @ApiResponse({ status: 200, type: [State] })
  async findAll(
    @Query('political_status') politicalStatus?: string,
  ): Promise<State[]> {
    return this.statesService.findAll(politicalStatus);
  }

  // GET /states/:id - Získá detail jednoho státu
  @Get(':id')
  @ApiOperation({ summary: 'Get state by ID' })
  @ApiResponse({ status: 200, type: State })
  @ApiResponse({ status: 404, description: 'State not found' })
  async findOne(@Param('id') id: string): Promise<State> {
    const state = await this.statesService.findOne(+id);
    if (!state) {
      throw new NotFoundException(`State with ID ${id} not found`);
    }
    return state;
  }

  // SEKCE STÁTŮ

  // GET /states/:id/sections - Získá všechny sekce státu
  @Get(':id/sections')
  @ApiOperation({ summary: 'Get all sections of state' })
  @ApiResponse({ status: 200, type: [StateSection] })
  async getSections(@Param('id') id: string): Promise<StateSection[]> {
    return this.statesService.getSections(+id);
  }

  // POST /states/:id/sections - Přidá novou sekci ke státu
  @Post(':id/sections')
  @ApiOperation({ summary: 'Add section to state' })
  @ApiResponse({ status: 201, type: StateSection })
  async addSection(
    @Param('id') id: string,
    @Body() createSectionDto: CreateSectionDto,
  ): Promise<StateSection> {
    return this.statesService.addSection(+id, createSectionDto);
  }

  // PUT /states/:stateId/sections/:sectionId - Aktualizuje sekci
  @Put(':stateId/sections/:sectionId')
  @ApiOperation({ summary: 'Update section' })
  @ApiResponse({ status: 200, type: StateSection })
  async updateSection(
    @Param('stateId') stateId: string,
    @Param('sectionId') sectionId: string,
    @Body() updateSectionDto: CreateSectionDto,
  ): Promise<StateSection> {
    return this.statesService.updateSection(
      +stateId,
      +sectionId,
      updateSectionDto,
    );
  }

  // DELETE /states/:stateId/sections/:sectionId - Smaže sekci
  @Delete(':stateId/sections/:sectionId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete section' })
  @ApiResponse({ status: 204, description: 'Section deleted' })
  async deleteSection(
    @Param('stateId') stateId: string,
    @Param('sectionId') sectionId: string,
  ): Promise<void> {
    await this.statesService.deleteSection(+stateId, +sectionId);
  }
}
