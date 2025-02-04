import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/jwt/jwt.guard';
import { AddressEndpoints } from 'src/common/endpoints/address.endpoint';

@ApiTags('Address')
@Controller('address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post(AddressEndpoints.create)
  @ApiOperation({ summary: 'Create a new address' })
  @ApiResponse({ status: 201, description: 'Address successfully created' })
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.createAddress(createAddressDto);
  }

  @UseGuards(JwtGuard)
  @Post(AddressEndpoints.findUserAddress)
  @ApiOperation({ summary: 'Retrieve user addresses' })
  @ApiResponse({ status: 200, description: 'List of user addresses' })
  findUserAddress(@Req() req) {
    return this.addressService.findUserAddress(req.user.id || req.user.userId);
  }

  @Get(AddressEndpoints.findAll)
  @ApiOperation({ summary: 'Retrieve all addresses' })
  @ApiResponse({ status: 200, description: 'List of addresses' })
  findAll() {
    return this.addressService.findAll();
  }

  @Get(AddressEndpoints.findOne)
  @ApiOperation({ summary: 'Get address by ID' })
  @ApiResponse({ status: 200, description: 'Address details' })
  @ApiResponse({ status: 404, description: 'Address not found' })
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(id);
  }

  @Patch(AddressEndpoints.update)
  @ApiOperation({ summary: 'Update an address' })
  @ApiResponse({ status: 200, description: 'Address updated' })
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(id, updateAddressDto);
  }

  @Delete(AddressEndpoints.remove)
  @ApiOperation({ summary: 'Delete an address' })
  @ApiResponse({ status: 200, description: 'Address deleted' })
  remove(@Param('id') id: string) {
    return this.addressService.remove(id);
  }
}
