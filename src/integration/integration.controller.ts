import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { TrayOrderDto } from '../common/dto/tray.dto';
import { TrayOrderProvider } from 'src/external/tray/trayOrder/trayOrder.provider';

@Controller()
export class IntegrationController {
  private readonly logger = new Logger(IntegrationController.name);

  constructor(
    private readonly integrationService: IntegrationService,
    private readonly trayOrderProvider: TrayOrderProvider,
  ) {}

  @Post('api/dados')
  receiveOrder(@Body() trayOrder: TrayOrderDto) {
    return this.integrationService.processOrder(trayOrder);
  }

  @Post('')
  @HttpCode(HttpStatus.OK)
  async receiveWebhook(@Body() payload: any) {
    this.logger.log('Notificação da Tray recebida!');
    this.logger.debug('Dados recebidos:', JSON.stringify(payload, null, 2)); // Use debug para payloads detalhados

    try {
      const { seller_id, scope_id, scope_name, act } = payload;

      if (!seller_id || !scope_id || !scope_name || !act) {
        this.logger.warn(
          'Payload da notificação é inválido ou incompleto.',
          payload,
        );
      } else {
        this.logger.log(
          `Processando webhook: ${scope_name}_${act} para a loja ${seller_id}`,
        );

        await this.integrationService.processWebhook(payload);

        this.logger.log(
          `Webhook ${scope_name}_${act} para a loja ${seller_id} processado com sucesso.`,
        );
      }

      const trayOrder = await this.trayOrderProvider.findOrderById(scope_id);

      await this.integrationService.processOrder({
        //@ts-expect-error
        Order: trayOrder,
      });
    } catch (error) {
      this.logger.error(
        'Falha ao processar a notificação da Tray',
        error.stack,
      );
    }

    return {
      message: 'Notificação da Tray recebida.',
    };
  }
}
