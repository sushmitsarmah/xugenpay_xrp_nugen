/* eslint-disable @typescript-eslint/no-explicit-any */
import { getRequest, postRequest } from './main';

// create a new user
export const createUpdateUser = async (body: any) => {
  return postRequest('/users/create', body);
};

export const searchUsers = async (search: string) => {
  return getRequest(`/users/search?search=${search}`);
};

export const getUserByUsername = async (username: string) => {
  return getRequest(`/users/${username}`);
};

export const getUserByAddress = async (address: string) => {
  return getRequest(`/users/wallet/${address}`);
};

export const getAllUsers = async () => {
  return getRequest(`/users`);
};

// Get user details by username
export const signinStatus = async (username: string) => {
  return getRequest(`/users/${username}`);
};