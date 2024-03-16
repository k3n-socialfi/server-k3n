import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';


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
  // @Get('favicon.ico')
  // getFavicon(@Res() res: Response) {
  //   // console.log('res:', res)
  //   return res.status(204).send();
  // }
}