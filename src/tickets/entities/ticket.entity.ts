import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn()  
  id : number

  @Column()
  title:string

  @Column()
  subject:string

  @Column()
  description:string

  @ManyToOne(()=> User , (user)=>user.tickets)
    user:User;

  @ManyToOne(()=> Ticket , (ticket)=> ticket.replies)
  replayTo:Ticket;

  @OneToMany(()=> Ticket , (ticket)=> ticket.replayTo , {nullable:true})
  replies:Ticket[]
}
