import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AnalyzerController } from './analyzer/analyzer.controller';
import { AnalyzerService } from './analyzer/analyzer.service';
import { AnalyzerModule } from './analyzer/analyzer.module';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return config.get('database')!;
      },
      inject: [ConfigService],
    }),
    AnalyzerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
