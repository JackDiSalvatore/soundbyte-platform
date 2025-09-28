import { Controller, Get, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { GenresService } from '../services/profiles/genres.service';

@ApiTags('Genres')
@Controller('api/genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Genres' })
  getGenres(@Req() req: Request) {
    return this.genresService.listAll();
  }
}
