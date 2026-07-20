    
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn , UpdateDateColumn } from "typeorm";
import userRoleEnum from "../enum/userRoleEnum";
import { Address } from "src/address/entities/address.entity";
import { Ticket } from "src/tickets/entities/ticket.entity";



@Entity({name:'users'})
export class User {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({unique:true})
    mobile:string

    @Column({nullable:false})
    display_name:string;

    @Column({nullable:true})
    password:string;

    @Column({type:'enum' , enum: userRoleEnum , default : userRoleEnum.NormalUser})
    role : userRoleEnum

    @OneToMany(()=>Address , (address)=> address.user)
    addresses : Address[];
 
    @OneToMany(()=>Ticket , (ticket)=> ticket.user)
    tickets : Ticket[];

    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date;
    
}
