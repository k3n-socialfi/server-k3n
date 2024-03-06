import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';


@Controller('health-check')
@ApiTags('HealthCheck')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello() {
    return {
      code: 200,
      data: this.appService.getHello(),
      message: "good"

    }
  }
}