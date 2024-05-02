import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { getRounds, hashSync} from "bcryptjs"
import { Exclude } from "class-transformer";

@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    name: string

    @Column({unique: true})
    email: string

    @Exclude()
    @Column()
    password: string

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @BeforeUpdate()
    @BeforeInsert()
    hashPassword() {
        const isEncrypted = getRounds(this.password)
        if (!isEncrypted){

            this.password = hashSync(this.password, 10)
        }
    }

}
