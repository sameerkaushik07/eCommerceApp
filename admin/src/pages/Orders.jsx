import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const statuses = ['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']
const normalizeStatus = (status) => status === 'Food Processing' ? 'Processing' : status === 'Packing' ? 'Packed' : status

const Orders = ({ token, setToken }) => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/list`, { headers: { token } })
        if (response.data.success) setOrders(response.data.orders)
        else toast.error(response.data.message)
      } catch (error) {
        if (error.response?.status === 401) {
          setToken('')
          toast.error('Admin session expired. Please log in again.')
          return
        }
        toast.error(error.response?.data?.message || error.message || 'Unable to load orders')
      }
    }
    fetchOrders()
  }, [token])

  const updateStatus = async (orderId, status) => {
    try {
      const response = await axios.patch(`${backendUrl}/api/order/status`, { orderId, status }, { headers: { token } })
      if (!response.data.success) throw new Error(response.data.message)
      setOrders((current) => current.map((order) => order._id === orderId ? { ...order, status } : order))
      toast.success('Order status updated')
    } catch (error) {
      if (error.response?.status === 401) {
        setToken('')
        toast.error('Admin session expired. Please log in again.')
        return
      }
      toast.error(error.response?.data?.message || error.message || 'Unable to update order')
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      <p className='mb-2'>Orders</p>
      {orders.map((order) => (
        <div key={order._id} className='border p-4 flex flex-col gap-2'>
          <p className='font-medium'>Order {order._id}</p>
          <p>{currency}{order.amount} - {normalizeStatus(order.status)}</p>
          <p className='text-sm'>{new Date(order.date).toLocaleString()}</p>
          <div className='border-t pt-2'>
            {order.items?.map((item, index) => (
              <div key={`${order._id}-${index}`} className='flex items-center gap-3 py-2 text-sm'>
                <img src={item.image?.[0]?.startsWith('http') ? item.image[0] : `${backendUrl}${item.image?.[0] || ''}`} className='w-12 h-12 object-cover' alt={item.name} />
                <span className='flex-1'>{item.name} · Size {item.size} · Qty {item.quantity}</span>
                <span>{currency}{item.price}</span>
              </div>
            ))}
          </div>
          <select value={normalizeStatus(order.status)} onChange={(event) => updateStatus(order._id, event.target.value)} className='border p-2 w-fit'>
            {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      ))}
    </div>
  )
}

export default Orders
