/**
 * Defines the structure of the successful authentication response from the Tray API.
 */
export interface TrayAuthResponse {
  code: number;
  message: string;
  access_token: string;
  refresh_token: string;
  date_expiration_access_token: string;
  date_expiration_refresh_token: string;
  date_activated: string;
  api_host: string;
  store_id: string;
}
