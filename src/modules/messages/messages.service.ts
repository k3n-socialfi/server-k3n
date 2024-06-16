import { HttpService } from '@nestjs/axios';
import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';

import { TwitterService } from '../twitter/twitter.service';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { generateId } from 'src/utils/helper';
import { Cache } from 'cache-manager';
import { UserService } from '../users/user.service';
import { CreateMessageDto } from './dto/request/send-message.dto';
import { replyDto } from './dto/request/send-message.dto';
import { Messages } from './entities/messages.entity';

@Injectable()
export class MessageService {
  constructor(
    private readonly httpService: HttpService,
    private readonly twitterService: TwitterService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @InjectRepository(Messages) private messageRep: MongoRepository<Messages>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger
  ){}

  async createMessage(userId: string, request: CreateMessageDto) {
    const messageId = generateId();
    const messageCreated = {
      messageId,
      requestType:  request.requestType,
      message: request.message,
      from: userId,
      to: request.to,
      amount: request.amount
    };
    console.log('messageCreated:', messageCreated);
    const saveMessage = this.messageRep.create(messageCreated);
    await this.messageRep.save(saveMessage);
    delete saveMessage._id;
    return saveMessage;
  }

  async findMessages(userId: string) {
    const messages = await this.messageRep.find({
      where: {
        to: userId
      }
    });
    const messagesResponse = messages.map((mess) => {
      const { _id, ...messageData } = mess;
      return messageData;
    });
    return messagesResponse;
  }

  async findOrderMessages(userId: string) {
    const messages = await this.messageRep.find({
      where: {
        from: userId
      }
    });
    const messagesResponse = messages.map((mess) => {
      const { _id, ...messageData } = mess;
      return messageData;
    });
    return messagesResponse;
  }

  async replyMessages(userId: string, reply: replyDto) {
    const message = await this.messageRep.findOne({
      where: {
        messageId: reply.messageId,
        to: userId
      }
    });

    message.reply = reply.reply;
    await this.messageRep.save(message);

    return message;
  }

}
