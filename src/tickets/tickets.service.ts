import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Ticket } from './entities/ticket.entity';
import { IsNull, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private readonly ticketRepository: Repository<Ticket>,
    private readonly userService: UserService,
  ) {}

  async create(createTicketDto: CreateTicketDto): Promise<Ticket> {
    const { userId, replayTo, ...TicketData } = createTicketDto;
    const user = await this.userService.findOne(userId);

    let replayToTicket: any = null;

    if (replayTo) {
      replayToTicket = await this.ticketRepository.findOne({
        where: { id: userId },
        relations: { replayTo: true },
      });
      if (replayToTicket.replayTo)
        throw new BadRequestException('شما نمیتوانید این تیکت را ریپلای کنید');
    }

    const ticket = this.ticketRepository.create({
      ...TicketData,
      user,
      replayTo: replayToTicket,
    });
    return this.ticketRepository.save(ticket);
  }

  async findAll() {
    const tickets: Ticket[] = await this.ticketRepository
      .createQueryBuilder('tickets')
      .where('tickets.replayTo IS NULL')
      .getMany();

    return tickets;
  }

  async findOne(id: number) {
    const ticket = await this.ticketRepository.findOneOrFail({
      where: { id },
      relations: { replies: true, replayTo: true },
    });

    return ticket;
  }
}
