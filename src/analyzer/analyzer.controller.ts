import {  Body, Controller, Delete, Get, HttpCode, Param, Post, Query, UnprocessableEntityException } from '@nestjs/common';
import { AnalyzerService } from './analyzer.service';
import { StringDto } from './string.dto';
import { validateFilters } from './validate-filter';
import { validateNL } from './natural-language';

@Controller('strings')
export class AnalyzerController {
    constructor(private  readonly analyzerService: AnalyzerService){}

    @Post()
    async create(@Body() stringDto: StringDto) {
        if (typeof stringDto.value !== 'string'){
            throw new UnprocessableEntityException('value must be a string');
        }
        return this.analyzerService.create(stringDto);
    }
    

    @Get()
    async getQuery(@Query() query: any) {
        const filters = validateFilters(query);
        return this.analyzerService.findAll(filters);
    }

    @Get('filter-by-natural-language')
    async nlFilter(@Query('query') query?: string) {
      const { decoded, parsed } = validateNL(query);

      const result = await this.analyzerService.findAll(parsed as any);

      return {
        data: result.data,
        count: result.count,
        interpreted_query: {
          original: decoded,
          parsed_filters: parsed,
        },
      };
  }
 
  @Get(':value')
    async getOne(@Param('value') value: string) {
        return this.analyzerService.findByValue(value);
  }

  @Delete(':value')
    @HttpCode(204)
    async delete(@Param('value') value: string) {
        const decoded = decodeURIComponent(value);
        await this.analyzerService.deleteByValue(decoded);
    }
}