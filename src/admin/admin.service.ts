
import { Injectable, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { LogInDto } from "./dto/login.dto";
import { comparePassword } from "src/utils/util.function";
import { AuthService } from "src/auth/auth.service";
@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService, private authService: AuthService) {}

  async findAll() {
    try {
      const Admin = await this.prisma.admin.findMany();
      return {
        success: true,
        data: Admin,
        message: "Admins fetched successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error fetching all records.');
    }
  }

  async login(loginDto: LogInDto) {
    try {
      const admin = await this.prisma.admin.findUnique({ where: { email: loginDto.email } });
      if (!admin) {
        throw new NotFoundException('Admin not found');
      }
      await comparePassword(loginDto.password, admin.password);
      const token = await this.authService.generateToken(admin.adminId);
      return {
        success: true,
        message: 'Login successful',
        data: {
          access_token: token,
          name: admin.name,
          email: admin.email,
        },
      };
    } catch (error) {
      throw new BadRequestException('Error logging in.');
    }
  }

  async findOne(id: string) {
    try {
      const Admin = await this.prisma.admin.findUnique({ where: { adminId: id } });
      if (!Admin) {
        throw new NotFoundException(`Admin with id ${id} not found`);
      }
      return {
        success: true,
        data: Admin,
        message: "Admin fetched successfully",
      };
    } catch (error) {
      throw error instanceof NotFoundException
        ? error
        : new BadRequestException('Error fetching record.');
    }
  }

  async create(data: CreateAdminDto) {
    try {
      const Admin = await this.prisma.admin.create({ data });
      return {
        success: true,
        data: Admin,
        message: "Admin created successfully",
      };
    } catch (error) {
      throw new BadRequestException('Error creating record.');
    }
  }

  async update(id: string, data: CreateAdminDto) {
    try {
      const Admin = await this.prisma.admin.update({ where: { adminId: id }, data });
      return {
        success: true,
        data: Admin,
        message: "Admin updated successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Admin with id: ${id} not found for update`);
      }
      throw new BadRequestException('Error updating record.');
    }
  }

  async delete(id: string) {
    try {
      const Admin = await this.prisma.admin.delete({ where: { adminId: id } });
      return {
        success: true,
        data: Admin,
        message: "Admin deleted successfully",
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Admin with id ${id} not found for deletion`);
      }
      throw new BadRequestException('Error deleting record.');
    }
  }
}
