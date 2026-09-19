import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { backendUrl, currency } from '../App'
import { toast } from 'react-toastify'

const Orders = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/order/list`)
        if (response.data.success) setOrders(response.data.orders)
        else toast.error(response.data.message)
      } catch (error) {
        toast.error(error.message)
      }
    }
    fetchOrders()
  }, [])

  return (
    <div className='flex flex-col gap-3'>
      <p className='mb-2'>Orders</p>
      {orders.map((order) => (
        <div key={order._id} className='border p-4 flex flex-col gap-2'>
          <p className='font-medium'>Order {order._id}</p>
          <p>{currency}{order.amount} - {order.status}</p>
          <p className='text-sm'>{new Date(order.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  )
}

export default Orders
