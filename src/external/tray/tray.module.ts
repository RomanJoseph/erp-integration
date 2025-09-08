import { Module } from '@nestjs/common';
import { TrayOrderProvider } from './trayOrder/trayOrder.provider';
import { TrayAuthenticationFactory } from './authentication/trayAuthentaction.factory';

@Module({
  providers: [TrayOrderProvider, TrayAuthenticationFactory],
  exports: [TrayOrderProvider, TrayAuthenticationFactory]
})
export class TrayModule {}
