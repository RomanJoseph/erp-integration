import qs from 'qs';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { Injectable } from '@nestjs/common';
import { TrayAuthResponse } from './trayAuthentication.interfaces';

/**
 * A factory class to create an authenticated Axios instance for interacting with the Tray Commerce API.
 * It handles the initial authentication flow to obtain an access token.
 */
@Injectable()
export class TrayAuthenticationFactory {
  private readonly consumer_key: string;
  private readonly consumer_secret: string;
  private readonly code: string;
  private readonly baseUrl: string;

  /**
   * Initializes the factory with credentials and the base URL from environment variables.
   * Make sure to have TRAY_CONSUMER_KEY, TRAY_CONSUMER_SECRET, TRAY_CODE, and TRAY_BASE_URL defined in your .env file.
   */
  constructor() {
    this.consumer_key = process.env.TRAY_CONSUMER_KEY!;
    this.consumer_secret = process.env.TRAY_CONSUMER_SECRET!;
    this.code = process.env.TRAY_CODE!;
    this.baseUrl = process.env.TRAY_BASE_URL!;

    if (
      !this.consumer_key ||
      !this.consumer_secret ||
      !this.code ||
      !this.baseUrl
    ) {
      throw new Error('Missing required Tray API environment variables.');
    }
  }

  /**
   * Performs authentication against the Tray API and returns an Axios instance
   * that is pre-configured to use the obtained access token for all subsequent requests.
   * @returns {Promise<AxiosInstance>} A promise that resolves to an authenticated Axios instance.
   */
  public async getAuthenticatedAxiosInstance(): Promise<AxiosInstance> {
    const authData = qs.stringify({
      consumer_key: this.consumer_key,
      consumer_secret: this.consumer_secret,
      code: this.code,
    });

    const authResult = await axios.post<TrayAuthResponse>(
      `${this.baseUrl}/auth`,
      authData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const { access_token } = authResult.data;

    const authenticatedAxiosInstance = axios.create({
      baseURL: this.baseUrl,
    });

    authenticatedAxiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        config.params = config.params || {};
        config.params.access_token = access_token;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    return authenticatedAxiosInstance;
  }
}
