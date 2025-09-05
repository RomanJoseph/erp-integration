import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { TrayOrderDto } from '../common/dto/tray.dto';
import {
  AceDataOrderDto,
  AceDataEntregaDto,
  AceDataItemDto,
  AceDataProdutoDto,
} from '../common/dto/acedata.dto';
import {
  TrayNotification,
  TrayNotificationDocument,
} from './schemas/tray-notification.schema';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(TrayNotification.name)
    private readonly trayNotificationModel: Model<TrayNotificationDocument>,
  ) {}

  async processOrder(trayOrderDto: TrayOrderDto): Promise<any> {
    const aceDataOrder = this.convert(trayOrderDto);
    const url = this.configService.get<string>('ACEDATA_ORDER_ENDPOINT');
    const token = this.configService.get<string>('ACEDATA_API_TOKEN');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await axios.post(url!, aceDataOrder, { headers });
      console.log('Resposta:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          'Erro ao enviar para AceData:',
          error.response?.data || error.message,
        );
      } else {
        console.error('Erro inesperado:', (error as Error).message);
      }
      throw error;
    }
  }

  async processWebhook(payload: any): Promise<TrayNotification> {
    const { seller_id, scope_id, scope_name, act } = payload;

    const documentToInsert = {
      seller_id: parseInt(seller_id, 10),
      scope_id: parseInt(scope_id, 10),
      scope_name,
      act,
      full_payload: payload,
      receivedAt: new Date(),
      processed: false,
    };

    const createdNotification = new this.trayNotificationModel(documentToInsert);
    return createdNotification.save();
  }

  private convert(trayOrder: TrayOrderDto): AceDataOrderDto {
    const trayOrderDetails = trayOrder.Order;

    const aceDataOrderEntrega = new AceDataEntregaDto();
    aceDataOrderEntrega.tipoFreteTransportador = '4';
    aceDataOrderEntrega.codigoRedespacho = null;
    aceDataOrderEntrega.vlrConhecRedespacho = null;
    aceDataOrderEntrega.tipoFreteRedespacho = null;
    aceDataOrderEntrega.codigoTransportador = null;
    aceDataOrderEntrega.vlrConhecTransportador =
      trayOrderDetails.shipment_value;

    const aceDataItems = trayOrderDetails.products_sold.map((wrapper) => {
      const productSold = wrapper.ProductsSold;
      const item = new AceDataItemDto();
      item.quantidade = productSold.quantity;
      item.vendaPara = 'CONSUMO';
      item.codigoTipoLista = 0;
      item.indexador = 0;
      item.unidade = null;
      item.precoDeListaData = null;
      item.precoDeLista = null;
      item.precoUnitarioIndex = null;
      item.valorUnitario = productSold.price;
      item.cfop = null;
      item.codigoAlmoxarifado = null;
      item.prazoEntrega = null;
      item.dataPrevEntrega = trayOrderDetails.estimated_delivery_date;
      item.dataPrevSaida = null;
      item.grupoFinanc = null;
      item.complemento = null;
      item.uniforme = null;

      const produto = new AceDataProdutoDto();
      produto.codigo = productSold.product_id;
      produto.codigoEmbalagem = null;
      item.produto = produto;

      return item;
    });

    const aceDataOrder = new AceDataOrderDto();
    aceDataOrder.empresa = 33;
    aceDataOrder.filial = 3;
    aceDataOrder.idParceiro = 'STEER';
    aceDataOrder.prefixo = 'PED';
    aceDataOrder.modo = 0;
    aceDataOrder.modo2 = 0;
    aceDataOrder.tipoPedido = 'VENDA NORMAL';
    aceDataOrder.dataPedido = trayOrderDetails.date;
    aceDataOrder.codigoCliente = null;
    aceDataOrder.codigoRepresentante = null;
    aceDataOrder.codigoFechadoPor = null;
    aceDataOrder.lanctoPadronizado = 92;
    aceDataOrder.codigoCondicaoPagto = null;
    aceDataOrder.condicaoPagtoPrazo = null;
    aceDataOrder.prazoMedio = null;
    aceDataOrder.tabelaOrigem = 'MKP';
    aceDataOrder.codigoIntegracao = trayOrderDetails.id;
    aceDataOrder.freteValor = trayOrderDetails.shipment_value;
    aceDataOrder.codigoIndexador = null;
    aceDataOrder.valorIndexador = null;
    aceDataOrder.dataIndexador = null;
    aceDataOrder.presencaComprador = 2;
    aceDataOrder.intermediadorDaVenda = null;
    aceDataOrder.codigoMarketplace = null;
    aceDataOrder.feitoPor = null;
    aceDataOrder.gerarRomaneio = 'N';
    aceDataOrder.observacoes = null;
    aceDataOrder.observacoesNotaFiscal = null;
    aceDataOrder.entrega = aceDataOrderEntrega;
    aceDataOrder.itens = aceDataItems;

    return aceDataOrder;
  }
}
