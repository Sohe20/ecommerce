    
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn , UpdateDateColumn } from "typeorm";
import userRoleEnum from "../enum/userRoleEnum";



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

    @CreateDateColumn()
    createdAt:Date

    @UpdateDateColumn()
    updatedAt:Date;
    
}
