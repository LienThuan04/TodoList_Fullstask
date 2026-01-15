import { Role, RoleDocument } from "@/role/schema/role.schema";
import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ADMIN_ROLE, USER_ROLE } from "@/databases/sample";

@Injectable()
export class DatabasesService implements OnModuleInit {
    private readonly logger = new Logger(DatabasesService.name); //in ra log khi khởi tạo module

    constructor(
        @InjectModel(Role.name) private roleModel: Model<RoleDocument>,
        private readonly configService: ConfigService,

    ) { };
    private async initializeRoles() {
        const roles = [
            { name: ADMIN_ROLE, description: 'Administrator with full access' },
            { name: USER_ROLE, description: 'Regular user with limited access' },
        ];
        for (const roleData of roles) {
            const existingRole = await this.roleModel.findOne({ name: roleData.name }).exec();
            if (!existingRole) {
                const role = await this.roleModel.create(roleData);
                role ?
                this.logger.log(`Created role: ${roleData.name}`) :
                this.logger.error(`Failed to create role: ${roleData.name}`);
            }
        }
    }

    async onModuleInit() {
        if (this.configService.get<boolean>('INIT_DB')) {
            this.logger.log('Initializing database with default data...');
            await this.initializeRoles();
        }
    };
}
