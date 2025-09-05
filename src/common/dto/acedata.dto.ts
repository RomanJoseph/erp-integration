export class AceDataOrderDto {
  empresa: number;
  filial: number;
  idParceiro: string;
  prefixo: string;
  modo: number;
  modo2: number;
  tipoPedido: string;
  dataPedido: string;
  codigoCliente: any;
  codigoRepresentante: any;
  codigoFechadoPor: any;
  lanctoPadronizado: number;
  codigoCondicaoPagto: any;
  condicaoPagtoPrazo: any;
  prazoMedio: any;
  tabelaOrigem: string;
  codigoIntegracao: string;
  freteValor: number;
  codigoIndexador: any;
  valorIndexador: any;
  dataIndexador: any;
  presencaComprador: number;
  intermediadorDaVenda: any;
  codigoMarketplace: any;
  feitoPor: any;
  gerarRomaneio: string;
  observacoes: any;
  observacoesNotaFiscal: any;
  entrega: AceDataEntregaDto;
  itens: AceDataItemDto[];
}

export class AceDataEntregaDto {
  tipoFreteTransportador: string;
  codigoRedespacho: any;
  vlrConhecRedespacho: any;
  tipoFreteRedespacho: any;
  codigoTransportador: any;
  vlrConhecTransportador: number;
}

export class AceDataItemDto {
  quantidade: number;
  vendaPara: string;
  codigoTipoLista: number;
  indexador: number;
  unidade: any;
  precoDeListaData: any;
  precoDeLista: any;
  precoUnitarioIndex: any;
  valorUnitario: number;
  cfop: any;
  codigoAlmoxarifado: any;
  prazoEntrega: any;
  dataPrevEntrega: string;
  dataPrevSaida: any;
  grupoFinanc: any;
  complemento: any;
  uniforme: any;
  produto: AceDataProdutoDto;
}

export class AceDataProdutoDto {
  codigo: number;
  codigoEmbalagem: any;
}
