import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AddressService {
   constructor(
    @InjectRepository(Address)
    private readonly addressRepository : Repository<Address>,
    @InjectRepository(User)
    private readonly userRepository : Repository<User>
   ){}



  async create(createAddressDto: CreateAddressDto) : Promise<Address> {
    const {userId , ...AddressData} = createAddressDto
    const user = await this.userRepository.findOneByOrFail({id:userId});
    const address = this.addressRepository.create({...AddressData,user});
    
    return this.addressRepository.save(address);
  }

  async findAll() : Promise<Address[]> {
    return await this.addressRepository.find({relations:{user:true}})
  }

  async findOne(id: number) : Promise<Address | null> {
    const address= await this.addressRepository.findOne({where : {id} , relations:{user:true}});
    if (!address) throw new NotFoundException(`آدرس ${id} پیدا نشد`);
    return address;
  }

  async update(id: number, updateAddressDto: UpdateAddressDto) : Promise<Address> {
    const address : Address | null = await this.findOne(id);
    Object.assign(address!,updateAddressDto);
    return this.addressRepository.save(address!);
  }

  async remove(id: number) : Promise<void> {
    const address : Address | null = await this.findOne(id);
    if (!address) throw new NotFoundException(`آدرس ${id} پیدا نشد`);
    await this.addressRepository.remove(address);
  }
}
