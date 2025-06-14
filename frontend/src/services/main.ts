/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const getRequest = async <T = any>(
  endpoint: string,
  config?: AxiosRequestConfig
): Promise<any> => {
  const response = await axios.get<T>(`${BASE_URL}${endpoint}`, config);
  return response.data;
};

export const postRequest = async <T = any>(
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<any> => {
  const response = await axios.post<T>(`${BASE_URL}${endpoint}`, data, config);
  return response.data;
};