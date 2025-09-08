import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bodyParser from 'body-parser';
import { IntegrationController } from './integration.controller';
import { IntegrationService } from './integration.service';
import {
  TrayNotification,
  TrayNotificationSchema,
} from './schemas/tray-notification.schema';
import { TrayModule } from 'src/external/tray/tray.module';
import { AceDataModule } from 'src/external/acedata/aceData.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TrayNotification.name, schema: TrayNotificationSchema },
    ]),
    TrayModule,
    AceDataModule
  ],
  controllers: [IntegrationController],
  providers: [IntegrationService],
})
export class IntegrationModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(bodyParser.urlencoded({ extended: true }))
      .forRoutes({ path: 'tray/webhook', method: RequestMethod.POST });
  }
}
