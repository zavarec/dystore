import {
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../database/prisma.service";
import { Role, User } from "@prisma/client";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(
    phone: string,
    name?: string,
    role: Role = Role.CUSTOMER,
  ): Promise<User> {
    return this.prisma.user.create({
      data: { phone, name, role },
    });
  }

  async createUserWithEmail(
    email: string,
    password: string,
    name?: string,
    role: Role = Role.CUSTOMER,
  ): Promise<User> {
    if (!email || !password) {
      throw new BadRequestException("Email и пароль обязательны");
    }

    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException("Пользователь с таким email уже существует");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
      },
    });
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    if (!user.password) {
      return false;
    }
    return bcrypt.compare(password, user.password);
  }

  async findOrCreateByPhone(phone: string): Promise<User> {
    let user = await this.findByPhone(phone);

    if (!user) {
      user = await this.createUser(phone);
    }

    return user;
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async updateUser(id: string, data: Partial<User>): Promise<User | null> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
