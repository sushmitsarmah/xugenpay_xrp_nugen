/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequest, postRequest } from './main';

// Initiate Xumm sign-in
export const initXummSignin = async () => {
  return postRequest('/xumm/signin/init');
};

// Check Xumm sign-in status
export const getXummSigninStatus = async (uuid: string) => {
  return getRequest(`/xumm/signin/status/${uuid}`);
};

// Initiate Xumm payment
export const initPayment = async (paymentData: any) => {
  return postRequest('/xumm/payment/init', paymentData);
};

// Check Xumm payment status
export const paymentStatus = async (uuid: string) => {
  return getRequest(`/xumm/payment/status/${uuid}`);
};