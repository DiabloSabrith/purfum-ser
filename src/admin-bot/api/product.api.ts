import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class ProductApi {
  constructor(private readonly http: HttpService) {}

  async getProducts(): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get(`${process.env.API_URL}/products`, {
        headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
      }),
    );
    return response.data;
  }

  async createProduct(payload: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.post(`${process.env.API_URL}/products`, payload, {
        headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
      }),
    );
    return response.data;
  }

  async updateProduct(id: number, payload: any): Promise<any> {
    const response = await firstValueFrom(
      this.http.patch(`${process.env.API_URL}/products/${id}`, payload, {
        headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
      }),
    );
    return response.data;
  }

  async deleteProduct(id: number): Promise<any> {
    const response = await firstValueFrom(
      this.http.delete(`${process.env.API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
      }),
    );
    return response.data;
  }

  async getOrders(): Promise<any[]> {
    const response = await firstValueFrom(
      this.http.get(`${process.env.API_URL}/order`, {
        headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
      }),
    );
    return response.data;
  }
  async searchProducts(params: {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
}): Promise<any[]> {
  const response = await firstValueFrom(
    this.http.get(`${process.env.API_URL}/products/search`, {
      params,
      headers: { Authorization: `Bearer ${process.env.ADMIN_API_KEY}` },
    }),
  );

  return response.data;
}
}
