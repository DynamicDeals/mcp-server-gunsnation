import axios, { AxiosInstance } from 'axios';
import {
  SearchFirearmsParams,
  SearchFirearmsResponse,
  GetFirearmParams,
  GetFirearmResponse,
  ApiResponse,
  ApiErrorResponse,
} from '../types';

export class GunsnationApiClient {
  private client: AxiosInstance;
  private apiKey: string;

  constructor(apiKey: string, baseUrl?: string) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: baseUrl || process.env.GUNSNATION_API_URL || 'https://api.gunsnation.com',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  private isErrorResponse(response: unknown): response is ApiErrorResponse {
    return (
      typeof response === 'object' &&
      response !== null &&
      'success' in response &&
      (response as ApiErrorResponse).success === false
    );
  }

  async searchFirearms(params: SearchFirearmsParams): Promise<ApiResponse<SearchFirearmsResponse>> {
    try {
      const queryParams = new URLSearchParams();

      if (params.query) {
        queryParams.append('q', params.query);
      }
      if (params.category) {
        queryParams.append('category', params.category);
      }
      if (params.limit !== undefined) {
        queryParams.append('limit', String(params.limit));
      }
      if (params.offset !== undefined) {
        queryParams.append('offset', String(params.offset));
      }

      const response = await this.client.get<SearchFirearmsResponse>(
        `/public/firearms/search?${queryParams.toString()}`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'API_ERROR',
        },
      };
    }
  }

  async getFirearm(params: GetFirearmParams): Promise<ApiResponse<GetFirearmResponse>> {
    try {
      const response = await this.client.get<GetFirearmResponse>(
        `/public/firearms/${params.id}`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data) {
        return error.response.data as ApiErrorResponse;
      }
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          code: 'API_ERROR',
        },
      };
    }
  }
}
