
import { Module } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminController } from "./admin.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
