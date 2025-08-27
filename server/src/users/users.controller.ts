import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Get,
  NotFoundException,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { RolesGuard } from "../common/guards/role.guard";
import { Roles } from "../common/decorators/role.decorator";
import { Role, User } from "@prisma/client";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "../common/decorators/current-user.decorator";

@ApiTags("Users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: "List users (director only)" })
  @ApiResponse({ status: 200, description: "Users list" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIRECTOR)
  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((u) => ({
      id: u.id,
      email: u.email,
      phone: u.phone,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt,
    }));
  }

  // Создание пользователя директором (например, менеджера)
  @ApiOperation({ summary: "Create user (director only)" })
  @ApiResponse({ status: 201, description: "User created" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIRECTOR)
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    const role = dto.role ?? Role.CUSTOMER;
    const user = await this.usersService.createUser(dto.phone, dto.name, role);
    return { id: user.id, phone: user.phone, name: user.name, role: user.role };
  }

  // Обновление пользователя и его роли директором
  @ApiOperation({ summary: "Update user (director only)" })
  @ApiResponse({ status: 200, description: "User updated" })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.DIRECTOR)
  @Patch(":id")
  async updateUser(
    @Param("id") id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() _current: User,
  ) {
    const updated = await this.usersService.updateUser(id, dto as any);
    if (!updated) {
      throw new NotFoundException("User not found");
    }
    return {
      id: updated.id,
      phone: updated.phone,
      name: updated.name,
      role: updated.role,
    };
  }
}
