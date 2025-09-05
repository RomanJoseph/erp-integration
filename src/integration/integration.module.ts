import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import { TrayNotification, TrayNotificationSchema } from './schemas/tray-notification.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: TrayNotification.name, schema: TrayNotificationSchema }]),
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule {}

