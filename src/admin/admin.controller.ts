
import { Controller, Get, Post, Body, Param, Delete, Put } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { CreateAdminDto } from "./dto/create-admin.dto";
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogInDto } from "./dto/login.dto";
@ApiTags('Admin')
@Controller("admin")
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Admin' })
  @ApiResponse({ status: 201, description: 'The Admin has been successfully created.' })
  create(@Body() createDto: CreateAdminDto) {
    return this.adminService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Admins' })
  @ApiResponse({ status: 200, description: 'List of all Admins.' })
  findAll() {
    return this.adminService.findAll();
  }

  @Post('newsletter')
  @ApiOperation({ summary: 'Get operation' })
  @ApiResponse({ status: 200, description: 'Success' })
  sendNewsletter(@Body() email: string) {
    return this.adminService.sendNewsletter(email);
  }

  @Post("login")
  @ApiOperation({ summary: 'Login a Admin' })
  @ApiResponse({ status: 200, description: 'The Admin has been successfully logged in.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  login(@Body() loginDto: LogInDto) {
    return this.adminService.login(loginDto);
  }

  @Get(":id")
  @ApiOperation({ summary: 'Get a Admin by ID' })
  @ApiResponse({ status: 200, description: 'The Admin with the given ID.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  findOne(@Param("id") id: string) {
    return this.adminService.findOne(id);
  }

  @Put(":id")
  @ApiOperation({ summary: 'Update a Admin by ID' })
  @ApiResponse({ status: 200, description: 'The Admin has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  update(@Param("id") id: string, @Body() updateDto: CreateAdminDto) {
    return this.adminService.update(id, updateDto);
  }

  @Delete(":id")
  @ApiOperation({ summary: 'Delete a Admin by ID' })
  @ApiResponse({ status: 200, description: 'The Admin has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  remove(@Param("id") id: string) {
    return this.adminService.delete(id);
  }
}
