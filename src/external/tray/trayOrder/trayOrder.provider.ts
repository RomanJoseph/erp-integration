import { Injectable, OnModuleInit } from '@nestjs/common';
import { TrayAuthenticationFactory } from '../authentication/trayAuthentaction.factory';
import { Order, TrayOrderResponse } from './trayOrder.interfaces';

@Injectable()
export class TrayOrderProvider {
  constructor(
    private readonly trayAuthenticationFactory: TrayAuthenticationFactory,
  ) {}

  /**
   * Initializes the authenticated Axios instance when the module starts.
   */

  public async findOrderById(id: number): Promise<Order> {
    const authentcatedAxiosFactory =
      await this.trayAuthenticationFactory.getAuthenticatedAxiosInstance();

    try {
      const response = await authentcatedAxiosFactory.get<TrayOrderResponse>(
        `/orders/${id}/complete`,
      );
      return response.data.Order;
    } catch (error) {
      console.error(`Failed to fetch order with ID ${id}:`, error);
      throw error;
    }
  }
}
