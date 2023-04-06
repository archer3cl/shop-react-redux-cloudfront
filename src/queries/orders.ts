import axios, { AxiosError } from 'axios';
import React from 'react';
import { useQuery, useQueryClient, useMutation } from 'react-query';
import API_PATHS from '~/constants/apiPaths';
import { OrderStatus } from '~/constants/order';
import { Address, Order, ResponseOrders } from '~/models/Order';

export function useOrders() {
  return useQuery<Order[], AxiosError>('orders', async () => {
    const res = await axios.get<ResponseOrders>(
      `${API_PATHS.order}/profile/order`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      }
    );
    return res.data.data;
  });
}

export function useInvalidateOrders() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries('orders', { exact: true }),
    []
  );
}

export function useUpdateOrderStatus() {
  return useMutation(
    (values: { id: string; status: OrderStatus; comment: string }) => {
      const { id, ...data } = values;
      return axios.put(`${API_PATHS.order}/profile/order/${id}/status`, data, {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      });
    }
  );
}

export function useSubmitOrder() {
  return useMutation((address: Address) => {
    return axios.put<Omit<Order, 'id'>>(
      `${API_PATHS.order}/profile/order`,
      address,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
        },
      }
    );
  });
}

export function useInvalidateOrder() {
  const queryClient = useQueryClient();
  return React.useCallback(
    (id: string) =>
      queryClient.invalidateQueries(['order', { id }], { exact: true }),
    []
  );
}

export function useDeleteOrder() {
  return useMutation((id: string) =>
    axios.delete(`${API_PATHS.order}/profile/order/${id}`, {
      headers: {
        Authorization: `Basic ${localStorage.getItem('authorization_token')}`,
      },
    })
  );
}
