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
    this.logger.debug('Dados recebidos:', JSON.stringify(payload, null, 2));

    this.processWebhookInBackground(payload).catch((error) => {
      this.logger.error(
        'Falha ao processar a notificação da Tray em segundo plano',
        error.stack,
      );
    });

    return {
      message: 'Notificação da Tray recebida.',
    };
  }

  private async processWebhookInBackground(payload: any): Promise<void> {
    try {
      const { seller_id, scope_id, scope_name, act } = payload;

      if (!seller_id || !scope_id || !scope_name || !act) {
        this.logger.warn(
          'Payload da notificação é inválido ou incompleto.',
          payload,
        );
        return;
      }

      this.logger.log(
        `Processando webhook: ${scope_name}_${act} para a loja ${seller_id}`,
      );

      await this.integrationService.processWebhook(payload);

      this.logger.log(
        `Webhook ${scope_name}_${act} para a loja ${seller_id} processado com sucesso.`,
      );

      const trayOrder = await this.trayOrderProvider.findOrderById(scope_id);

      console.log(trayOrder);

      await this.integrationService.processOrder({
        //@ts-expect-error
        Order: trayOrder,
      });
    } catch (error) {
      this.logger.error(
        'Falha ao processar a notificação da Tray',
        error.stack,
      );
      throw error;
    }
  }
}