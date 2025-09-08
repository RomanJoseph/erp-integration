export interface EnderecoFaturamento {
  Endereco: string;
  Numero: number;
  Complemento: string;
  Bairro: string;
  CEP: string;
  Cidade: {
    CodigoIBGE: string;
  };
}

export interface Faturamento {
  CondicaoPagamento: number;
  TipoLista: number;
  TipoVenda: string;
  TipoRecebimento: number;
  Atividade: number;
  Area: string;
  ColaboradorResponsavel: number;
  Representante: number;
}

export interface CreatePartnerPayload {
  Empresa: number;
  Filial: number;
  IdParceiro: string;
  DataCadastro: string; // "YYYY-MM-DD"
  NomeFantasia: string;
  RazaoSocial: string;
  TipoDocumento: 'CNPJ' | 'CPF';
  NroDocumento: string;
  TipoInscricao: string;
  NroInscricao: string;
  InscricaoMunicipal: string;
  ContribuinteICMS: 'S' | 'N';
  Fone1: string;
  Fone2: string;
  Fone3: string;
  Email: string;
  Administracao: string;
  EnquadramentoFederal: string;
  EnquadramentoEstadual: string;
  IndicadorCliente: 'S' | 'N';
  IndicadorAluno: 'S' | 'N';
  IndicadorFornecedor: 'S' | 'N';
  IndicadorRepresentante: 'S' | 'N';
  IndicadorTransportador: 'S' | 'N';
  IndicadorColaborador: 'S' | 'N';
  IndicadorContato: 'S' | 'N';
  IndicadorTelemarketing: 'S' | 'N';
  EnderecoFaturamento: EnderecoFaturamento;
  Faturamento: Faturamento;
}

export interface FindPartnerPayload {
  Empresa: number;
  Filial: number;
  IdParceiro: string;
  TipoTerceiro: string;
  CodTerceiro: number | null;
  CNPJTerceiro: string | null;
  CodAltSsdSeq: number | null;
}

export interface FindPartnerResponse {
  Sucesso: boolean
  Dados: {
    Empresa: number
    Filial: number
    EmpresaMaster: number
    CodigoCliente: number
    TipoDocumento: string
    Documento: string
    DocumentoSemMascara: string
    TipoInscricao: string
    Inscricao: string
    Nome: string
    RazaoSocial: string
    DataCadastro: string
    Status: string
    Telefone: string
    Telefone2: string
    Telefone3: string
    Email: string
    Endereco: string
    Numero: number
    Complemento: string
    Bairro: string
    CEP: string
    Cidade: {
      Codigo: number
      Nome: string
      UF: string
      CodigoIBGE: string
    }
    IndicadorCliente: string
    IndicadorFornecedor: string
    IndicadorRepresentante: string
    IndicadorTransportador: string
    IndicadorColaborador: string
    IndicadorContato: string
    Representantes: Array<{
      Item: number
      CodigoRepresentante: number
      NomeRepresentante: string
    }>
    ColaboradorResp: Array<{
      Item: number
      CodigoColaborador: number
      NomeColaborador: string
    }>
    ClassificacaoSistema: {
      Codigo: number
      Descricao: string
    }
    ClassificacaoEmpresa: {
      Codigo: number
      Descricao: string
    }
    ClassificacaoRepresentante: {
      Codigo: number
      Descricao: string
    }
    ContribuinteIcms: string
    InformacoesVencto: {
      VenctoSeg: string
      VenctoTer: string
      VenctoQua: string
      VenctoQui: string
      VenctoSex: string
      DiasDoMes: string
    }
    RaioEntrega: string
    NomeGrupoReferencia: string
  }[]
  Resposta: {
    Mensagem: string
  }
}
