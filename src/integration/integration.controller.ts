import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { IntegrationService } from './integration.service';
import { TrayOrderDto } from '../common/dto/tray.dto';

@Controller('api')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('dados')
  receiveOrder(@Body() trayOrder: TrayOrderDto) {
    return this.integrationService.processOrder(trayOrder);
  }

  @Post('/webhook')
  @HttpCode(HttpStatus.OK)
  async receiveWebhook(@Body() payload: any) {
    console.log('Notificação da Tray recebida!');
    console.log('Dados recebidos:', payload);

    const { seller_id, scope_id, scope_name, act } = payload;

    if (!seller_id || !scope_id || !scope_name || !act) {
      console.warn('Payload inválido ou incompleto recebido:', payload);
      throw new BadRequestException(
        'Payload da notificação é inválido ou incompleto.',
      );
    }

    console.log(`Processando: ${scope_name}_${act} para a loja ${seller_id}`);

    try {
      const result = await this.integrationService.processWebhook(payload);
      console.log(`Notificação salva com sucesso no DB.`);
      return {
        message: 'Notificação da Tray recebida e registrada com sucesso!',
        id: result,
      };
    } catch (error) {
      console.error('Erro ao processar a notificação da Tray:', error);
      throw new Error('Erro interno ao salvar a notificação.');
    }
  }
}
