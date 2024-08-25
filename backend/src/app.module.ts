import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FamilyTreeController } from './family-tree/family-tree.controller';
import { FamilyTreeService } from './family-tree/family-tree.service';

@Module({
  imports: [],
  controllers: [AppController, FamilyTreeController],
  providers: [AppService, FamilyTreeService],
})
export class AppModule {}
