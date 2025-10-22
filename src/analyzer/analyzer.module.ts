import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { String } from './string.entity';
import { AnalyzerController } from './analyzer.controller';
import { AnalyzerService } from './analyzer.service';

@Module({
    imports: [TypeOrmModule.forFeature([String])],
    controllers: [AnalyzerController],
    providers: [AnalyzerService]
})
export class AnalyzerModule {}
