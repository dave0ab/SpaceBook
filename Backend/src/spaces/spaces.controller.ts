import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SpacesService } from './spaces.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UpdateSpaceDto } from './dto/update-space.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('spaces')
@ApiBearerAuth('JWT-auth')
@Controller('spaces')
export class SpacesController {
  constructor(private readonly spacesService: SpacesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Create a new space (Admin only)' })
  @ApiResponse({ status: 201, description: 'Space created successfully' })
  create(@Body() createSpaceDto: CreateSpaceDto) {
    return this.spacesService.create(createSpaceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all spaces' })
  @ApiQuery({ name: 'type', required: false, description: 'Filter by space type' })
  @ApiResponse({ status: 200, description: 'List of all spaces' })
  findAll(@Query('type') type?: string) {
    if (type) {
      return this.spacesService.findByType(type);
    }
    return this.spacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a space by ID' })
  @ApiResponse({ status: 200, description: 'Space found' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  findOne(@Param('id') id: string) {
    return this.spacesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Update a space (Admin only)' })
  @ApiResponse({ status: 200, description: 'Space updated successfully' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  update(@Param('id') id: string, @Body() updateSpaceDto: UpdateSpaceDto) {
    return this.spacesService.update(id, updateSpaceDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.admin)
  @ApiOperation({ summary: 'Delete a space (Admin only)' })
  @ApiResponse({ status: 200, description: 'Space deleted successfully' })
  @ApiResponse({ status: 404, description: 'Space not found' })
  remove(@Param('id') id: string) {
    return this.spacesService.remove(id);
  }
}













