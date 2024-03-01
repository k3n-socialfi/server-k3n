import { BadRequestException, Inject, Injectable, NotFoundException, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UserService {
    constructor(
    ) { }
    async getUsers() {
        return []
    }
}