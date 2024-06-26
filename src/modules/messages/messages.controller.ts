import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from '../auth/guards/accessToken.guard';
import { CreateMessageDto } from './dto/request/send-message.dto';
import { replyDto } from './dto/request/send-message.dto';
import { Request } from 'express';

import { MessageService } from './messages.service';
@Controller('message')
@ApiTags('Message')
export class MessagesController {
  constructor(private readonly MessagesService: MessageService) {}

  @Post('message/create')
  //   @ApiCreatedResponse({
  //     description: 'Create user by admin response',
  //     type: SwaggerCreateUserByAdminResponseDto
  //   })
  @UseGuards(AccessTokenGuard)
  public async createMessage(@Req() req: Request, @Body() request: CreateMessageDto) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    return {
      code: 201,
      message: 'Create message successful',
      data: await this.MessagesService.createMessage(userObject.sub, request)
    };
  }

  @Get('message')
  @UseGuards(AccessTokenGuard)
  public async getMessages(@Req() req: Request) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    // console.log('req:', req.user)
    // let { page, limit } = query;
    // page = page ? +page : 0;
    // limit = limit ? +limit : 10;
    return {
      code: 200,
      message: 'Get messages successful',
      data: await this.MessagesService.findMessages(userObject.sub)
    };
  }

  @Put('message')
  @UseGuards(AccessTokenGuard)
  public async replyMessages(@Req() req: Request, @Body() request: replyDto) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    // console.log('req:', req.user)
    // let { page, limit } = query;
    // page = page ? +page : 0;
    // limit = limit ? +limit : 10;
    return {
      code: 200,
      message: 'reply messages successful',
      data: await this.MessagesService.replyMessages(userObject.sub, request)
    };
  }

  @Get('order-message')
  @UseGuards(AccessTokenGuard)
  public async getOrderMessages(@Req() req: Request) {
    const userObject = JSON.parse(JSON.stringify(req.user));
    // console.log('req:', req.user)
    // let { page, limit } = query;
    // page = page ? +page : 0;
    // limit = limit ? +limit : 10;
    return {
      code: 200,
      message: 'Get order messages successful',
      data: await this.MessagesService.findOrderMessages(userObject.sub)
    };
  }
}
