import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Injectable } from '@nestjs/common';

import * as dotenv from 'dotenv';
dotenv.config();

/**
 * A factory class to create an authenticated Axios instance for interacting with the AceData API.
 */
@Injectable()
export class AceDataAuthenticationFactory {
  private readonly accessToken: string;
  private readonly baseUrl: string;

  /**
   * Initializes the factory with credentials and the base URL from environment variables.
   * Make sure to have ACEDATA_ACCESS_TOKEN and ACEDATA_BASE_URL defined in your .env file.
   */
  constructor() {
    this.accessToken = process.env.ACEDATA_API_TOKEN!;
    this.baseUrl = process.env.ACEDATA_BASE_URL!;

    if (!this.accessToken || !this.baseUrl) {
      throw new Error('Missing required AceData API environment variables.');
    }
  }

  /**
   * Returns an Axios instance that is pre-configured to use the access token
   * in the Authorization header for all subsequent requests.
   * @returns {Promise<AxiosInstance>} A promise that resolves to an authenticated Axios instance.
   */
  public async getAuthenticatedAxiosInstance(): Promise<AxiosInstance> {
    const authenticatedAxiosInstance = axios.create({
      baseURL: this.baseUrl,
    });

    // Use an interceptor to automatically add the Authorization header to every request.
    authenticatedAxiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.headers.Authorization = this.accessToken;
        config.headers['Content-Type'] = 'application/json';
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return authenticatedAxiosInstance;
  }
}
