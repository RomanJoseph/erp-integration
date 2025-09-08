export class AceDataSituacaoItemDto {
  CstIcmCod: string;
}

export class AceDataProdutoDto {
  Codigo: string;
  CodigoEmbalagem: string | null;
}

export class AceDataItemDto {
  Quantidade: number;
  VendaPara: string;
  CodigoTipoLista: number;
  Indexador: string;
  Unidade: string | null;
  PrecoDeListaData: string | null;
  PrecoDeLista: number | null;
  PrecoUnitarioIndex: number | null;
  ValorUnitario: string;
  CFOP: string | null;
  CodigoAlmoxarifado: number | null; 
  PrazoEntrega: number | null;
  DataPrevEntrega: string;
  DataPrevSaida: string | null;
  GrupoFinanc: number | null;
  Complemento: string | null;
  Uniforme: string | null;
  Produto: AceDataProdutoDto;
  SituacaoItem: AceDataSituacaoItemDto;
}

export class AceDataEntregaDto {
  TipoFreteTransportador: string;
  CodigoRedespacho: number | null;
  VlrConhecRedespacho: number | null;
  TipoFreteRedespacho: string | null;
  CodigoTransportador: number | null;
  VlrConhecTransportador: string;
}

export class AceDataOrderDto {
  Empresa: number;
  Filial: number;
  IdParceiro: string;
  Prefixo: string;
  Modo: string;
  Modo2: string;
  TipoPedido: string;
  DataPedido: string;
  CodigoCliente: number | null;
  CodigoRepresentante: number | null;
  CodigoFechadoPor: number | null;
  LanctoPadronizado: number;
  CodigoCondicaoPagto: number | null;
  CondicaoPagtoPrazo: string | null;
  PrazoMedio: number | null;
  TabelaOrigem: string;
  CodigoIntegracao: string;
  FreteValor: string;
  CodigoIndexador: number | null;
  ValorIndexador: number | null;
  DataIndexador: string | null;
  PresencaComprador: number;
  IntermediadorDaVenda: number | null;
  CodigoMarketplace: string | null;
  FeitoPor: string | null;
  GerarRomaneio: 'S' | 'N';
  Observacoes: string | null;
  ObservacoesNotaFiscal: string | null;
  Entrega: AceDataEntregaDto;
  Itens: AceDataItemDto[];
  CodigoTipoRecbto: number;
}