import { Injectable, OnModuleInit } from '@nestjs/common';
import { AxiosInstance } from 'axios';
import { AceDataAuthenticationFactory } from '../authentication/authenticationAceData.factory';
import { CreatePartnerPayload, FindPartnerPayload, FindPartnerResponse } from './aceDataCustomer.interfaces';

/**
 * A provider class to interact with AceData's API endpoints.
 */
@Injectable()
export class AceDataCustomerProvider {
  private axiosInstance: AxiosInstance;
  private readonly endpoint = '/apiintterceiro.aspx';

  constructor(
    private readonly aceDataAuthenticationFactory: AceDataAuthenticationFactory,
  ) {}

  /**
   * Creates a new partner in the AceData system.
   * @param {CreatePartnerPayload} partnerData - The data for the new partner.
   * @returns {Promise<any>} A promise that resolves with the API response. Since the response body is unknown, it's typed as 'any'.
   */
  public async createPartner(partnerData: CreatePartnerPayload): Promise<any> {
    try {
      const axiosInstance =
       await this.aceDataAuthenticationFactory.getAuthenticatedAxiosInstance();

      const response = await axiosInstance.post(this.endpoint, partnerData);
      return response.data;
    } catch (error) {
      console.error('Failed to create partner:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Finds a partner in the AceData system by their CNPJ.
   * @param {string} cnpj - The CNPJ of the partner to find.
   * @returns {Promise<any>} A promise that resolves with the API response.
   */
  public async findPartner(cnpj: string): Promise<FindPartnerResponse | null> {
    try {
      const findData: FindPartnerPayload = {
        Empresa: 33,
        Filial: 3,
        IdParceiro: 'STEER',
        TipoTerceiro: 'C',
        CodTerceiro: null,
        CNPJTerceiro: cnpj,
        CodAltSsdSeq: null,
      };

      const axiosInstance =
          await this.aceDataAuthenticationFactory.getAuthenticatedAxiosInstance();

      const response = await axiosInstance.get(this.endpoint, { data: findData });
      return response.data;
    } catch (error) {
      console.error(`Failed to find partner with CNPJ ${cnpj}:`, error.response?.data || error.message);
      return null;
    }
  }
}

