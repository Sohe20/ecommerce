    
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn , UpdateDateColumn } from "typeorm";
import userRoleEnum from "../enum/userRoleEnum";
import { Address } from "src/address/entities/address.entity";



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

    @OneToMany(()=>Address , (Address)=> Address.user)
    addresses : Address[];


    @CreateDateColumn()
    created_at:Date

    @UpdateDateColumn()
    updated_at:Date;
    
}
