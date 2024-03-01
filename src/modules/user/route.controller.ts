import { Body, Controller, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './route.service';


@Controller('v1/user')
@ApiTags('User')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('')
    @ApiOkResponse({})
    // @ApiNotFoundResponse({})
    // @ApiBadRequestResponse({})
    public async getUser() {
        return await this.userService.getUsers();
    }
}