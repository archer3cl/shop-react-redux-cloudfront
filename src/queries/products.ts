import axios, { AxiosError } from 'axios';
import API_PATHS from '~/constants/apiPaths';
import {
  AvailableProduct,
  ResponseProduct,
  ResponseProducts,
} from '~/models/Product';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import React from 'react';

export function useAvailableProducts() {
  return useQuery<AvailableProduct[], AxiosError>(
    'available-products',
    async () => {
      const res = await axios.get<ResponseProducts>(
        `${API_PATHS.bff}/products`
      );
      return res.data.data;
    }
  );
}

export function useInvalidateAvailableProducts() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries('available-products', { exact: true }),
    []
  );
}

export function useAvailableProduct(id?: string) {
  return useQuery<AvailableProduct, AxiosError>(
    ['product', { id }],
    async () => {
      const res = await axios.get<ResponseProduct>(
        `${API_PATHS.bff}/products/${id}`
      );
      return res.data.data;
    },
    { enabled: !!id }
  );
}

export function useRemoveProductCache() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id?: string) =>
      queryClient.removeQueries(['product', { id }], { exact: true }),
    []
  );
}

export function useUpsertAvailableProduct() {
  return useMutation((values: AvailableProduct) =>
    axios.put<AvailableProduct>(`${API_PATHS.bff}/products`, values, {
      headers: {
        Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
      },
    })
  );
}

export function useDeleteAvailableProduct() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.bff}/product/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
      },
    })
  );
}
