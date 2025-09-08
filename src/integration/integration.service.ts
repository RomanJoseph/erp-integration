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
  AceDataSituacaoItemDto,
} from '../common/dto/acedata.dto';
import {
  TrayNotification,
  TrayNotificationDocument,
} from './schemas/tray-notification.schema';
import { AceDataCustomerProvider } from 'src/external/acedata/acedataCustomer/aceDataCustomer.provider';
import { CreatePartnerPayload } from 'src/external/acedata/acedataCustomer/aceDataCustomer.interfaces';

@Injectable()
export class IntegrationService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(TrayNotification.name)
    private readonly trayNotificationModel: Model<TrayNotificationDocument>,
    private readonly aceDataCustomerProvider: AceDataCustomerProvider
  ) {}

  async processOrder(trayOrderDto: TrayOrderDto): Promise<any> {
    const aceDataOrder = await this.convert(trayOrderDto);
    const url = this.configService.get<string>('ACEDATA_ORDER_ENDPOINT');
    const token = this.configService.get<string>('ACEDATA_API_TOKEN');

    const headers = {
      'Content-Type': 'application/json',
      Authorization: token,
    };

    
    try {
      const response = await axios.post(url!, aceDataOrder, { headers });
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

private async convert(trayOrder: TrayOrderDto): Promise<AceDataOrderDto> {
  const trayOrderDetails = trayOrder.Order;

  const customerDoc =
    trayOrderDetails.Customer.cnpj || trayOrderDetails.Customer.cpf;

  // Busca ou cria o parceiro (cliente)
  let customer = await this.aceDataCustomerProvider.findPartner(customerDoc);

  if (!customer || !customer.Sucesso || !customer.Dados?.length) {
    const isPessoaFisica = !!trayOrderDetails.Customer.cpf;
    const address = trayOrderDetails.Customer.CustomerAddresses?.[0]?.CustomerAddress;

    const partnerPayload: CreatePartnerPayload = {
      Empresa: 33,
      Filial: 3,
      IdParceiro: 'STEER',
      DataCadastro: trayOrderDetails.Customer.registration_date || new Date().toISOString().split('T')[0],
      NomeFantasia: trayOrderDetails.Customer.name,
      RazaoSocial: trayOrderDetails.Customer.name,
      TipoDocumento: isPessoaFisica ? 'CPF' : 'CNPJ',
      NroDocumento: customerDoc,
      TipoInscricao: 'ISENTO',
      NroInscricao: 'ISENTO',
      InscricaoMunicipal: '',
      ContribuinteICMS: 'N',
      Fone1: trayOrderDetails.Customer.phone || trayOrderDetails.Customer.cellphone || '',
      Fone2: '',
      Fone3: '',
      Email: trayOrderDetails.Customer.email || 'sememail@cliente.com',
      Administracao: 'PRIVADA',
      EnquadramentoFederal: 'NE',
      EnquadramentoEstadual: 'RPA',
      IndicadorCliente: 'S',
      IndicadorAluno: 'N',
      IndicadorFornecedor: 'N',
      IndicadorRepresentante: 'N',
      IndicadorTransportador: 'N',
      IndicadorColaborador: 'N',
      IndicadorContato: 'N',
      IndicadorTelemarketing: 'N',
      EnderecoFaturamento: {
        Endereco: address?.address || trayOrderDetails.Customer.address || 'ENDERECO NÃO INFORMADO',
        Numero: parseInt(address?.number || trayOrderDetails.Customer.number || '0'),
        Complemento: address?.complement || trayOrderDetails.Customer.complement || '',
        Bairro: address?.neighborhood || trayOrderDetails.Customer.neighborhood || '',
        CEP: (address?.zip_code || trayOrderDetails.Customer.zip_code || '').replace(/\D/g, ''),
        Cidade: {
          CodigoIBGE: '3550308', // Exemplo: São Paulo. Idealmente, este código deveria ser dinâmico.
        },
      },
      Faturamento: {
        CondicaoPagamento: 0,
        TipoLista: 0,
        TipoVenda: 'CONSUMO',
        TipoRecebimento: 0,
        Atividade: 0,
        Area: '',
        ColaboradorResponsavel: 0,
        Representante: 0,
      },
    };

    const creationResponse = await this.aceDataCustomerProvider.createPartner(partnerPayload);

    if (!creationResponse || creationResponse.Sucesso === false) {
      throw new Error(`Erro ao criar cliente: ${JSON.stringify(creationResponse.Erros)}`);
    }

    customer = await this.aceDataCustomerProvider.findPartner(customerDoc);
    if (!customer || !customer.Dados?.length) {
      throw new Error('Cliente criado, mas não foi possível recuperar o código.');
    }
  }

  // <-- CORREÇÃO: Obter o código do cliente da resposta da API
  const customerCode = customer.Dados[0].CodigoCliente;

  const aceDataOrderEntrega = new AceDataEntregaDto();
  aceDataOrderEntrega.TipoFreteTransportador = '4';
  aceDataOrderEntrega.CodigoRedespacho = null;
  aceDataOrderEntrega.VlrConhecRedespacho = null;
  aceDataOrderEntrega.TipoFreteRedespacho = null;
  aceDataOrderEntrega.CodigoTransportador = null;
  aceDataOrderEntrega.VlrConhecTransportador = String(trayOrderDetails.shipment_value);

  const aceDataItems = trayOrderDetails.ProductsSold.map((wrapper) => {
    const productSold = wrapper.ProductsSold;
    const item = new AceDataItemDto();

    item.Quantidade = parseFloat(String(productSold.quantity));
    item.VendaPara = 'CONSUMO';
    item.CodigoTipoLista = 1;
    item.Indexador = 'REAL';
    item.Unidade = "PC"; 
    item.PrecoDeListaData = null;
    item.PrecoDeLista = null;
    item.PrecoUnitarioIndex = null;
    item.ValorUnitario = String(productSold.price);
    item.CFOP = null;
    item.CodigoAlmoxarifado = 2;
    item.PrazoEntrega = null;
    item.DataPrevEntrega = trayOrderDetails.estimated_delivery_date || trayOrderDetails.date;
    item.DataPrevSaida = null;
    item.GrupoFinanc = 4;
    item.Complemento = null;
    item.Uniforme = 'N';
    
    const situacao = new AceDataSituacaoItemDto();
    // <-- CORREÇÃO: Campo e valor ajustados para operação não tributada.
    situacao.CstIcmCod = '400'; 
    item.SituacaoItem = situacao;

    const produto = new AceDataProdutoDto();
    produto.Codigo = "10066"//String(productSold.product_id);
    produto.CodigoEmbalagem = null;
    item.Produto = produto;

    return item;
  });

  const aceDataOrder = new AceDataOrderDto();

  aceDataOrder.Empresa = 33;
  aceDataOrder.Filial = 3;
  aceDataOrder.IdParceiro = 'STEER';
  aceDataOrder.Prefixo = 'PED';
  aceDataOrder.Modo = '0';
  aceDataOrder.Modo2 = '';
  aceDataOrder.TipoPedido = 'VENDA NORMAL';
  aceDataOrder.DataPedido = trayOrderDetails.date;
  aceDataOrder.CodigoCliente = customerCode; // <-- CORREÇÃO: Usando o código do cliente obtido
  aceDataOrder.CodigoRepresentante = 0;
  aceDataOrder.CodigoFechadoPor = 0;
  aceDataOrder.LanctoPadronizado = 92;
  aceDataOrder.CodigoCondicaoPagto = null;
  aceDataOrder.CondicaoPagtoPrazo = null;
  aceDataOrder.PrazoMedio = null;
  aceDataOrder.CodigoTipoRecbto = 8;
  aceDataOrder.TabelaOrigem = 'MKP';
  aceDataOrder.CodigoIntegracao = trayOrderDetails.id;
  aceDataOrder.FreteValor = String(trayOrderDetails.shipment_value);
  aceDataOrder.CodigoIndexador = null;
  aceDataOrder.ValorIndexador = null;
  aceDataOrder.DataIndexador = null;
  aceDataOrder.PresencaComprador = 2;
  aceDataOrder.IntermediadorDaVenda = null;
  aceDataOrder.CodigoMarketplace = null;
  aceDataOrder.FeitoPor = 'integrador@steer.com.br';
  aceDataOrder.GerarRomaneio = 'N';
  aceDataOrder.Observacoes = `Pedido Tray ID: ${trayOrderDetails.id}`;
  aceDataOrder.ObservacoesNotaFiscal = 'NF gerada via integração.';
  aceDataOrder.Entrega = aceDataOrderEntrega;
  aceDataOrder.Itens = aceDataItems;

  return aceDataOrder;
}
}