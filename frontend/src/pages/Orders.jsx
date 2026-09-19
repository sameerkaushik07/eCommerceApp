import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Title from "../components/Title";
import { toast } from "react-toastify";

const Orders = ()=>{
    const [orders, setOrders] = useState([]);
    const [trackingOrderId, setTrackingOrderId] = useState(null);
    const [trackingLoading, setTrackingLoading] = useState(null);
    const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const getImageUrl = (image) => {
        if (!image) return '';
        return image.startsWith('http') ? image : `${backendUrl}${image.startsWith('/') ? image : `/${image}`}`;
    };
    const statusSteps = ['Order Placed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];
    const displayStatus = (status) => status === 'Food Processing' ? 'Processing' : status === 'Packing' ? 'Packed' : status;
    const getStatusIndex = (status) => status === 'Cancelled' ? -1 : statusSteps.indexOf(displayStatus(status));

    const fetchOrders = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const response = await axios.get(`${backendUrl}/api/order/user`, { headers: { token } });
                if (!response.data.success) throw new Error(response.data.message);
                setOrders(response.data.orders);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Unable to load orders');
        } finally {
            setLoading(false);
        }
    }, [backendUrl]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const toggleTracking = async (orderId) => {
        if (trackingOrderId === orderId) {
            setTrackingOrderId(null);
            return;
        }
        setTrackingLoading(orderId);
        await fetchOrders();
        setTrackingOrderId(orderId);
        setTrackingLoading(null);
    };

    return(
        <div className="border-t pt-6">
            <div className="text-2xl">
                <Title text1={'MY'} text2={'ORDERS'} />

            </div>

            <div>
                {loading && <p className="py-8 text-gray-500">Loading orders...</p>}
                {!loading && orders.length === 0 && <p className="py-8 text-gray-500">You have not placed any orders yet.</p>}
                {orders.map((order) => order.items.map((item, index) => (
                        <div key={`${order._id}-${index}`} className="py-5 border-t border-b text-gray-700 flex flex-col gap-4">
                            <div className="flex items-start gap-6 text-sm">
                                <img src={getImageUrl(item.image?.[0])} className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded border bg-gray-50" alt={item.name} />
                                <div>
                                    <p className="sm:text-base font-medium">{item.name}</p>
                                    <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                                        <p className="text-lg">${item.price}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <p>Size: {item.size}</p>
                                    </div>
                                    <p className="mt-2">Date: <span className="text-gray-400">{new Date(order.date).toLocaleDateString()}</span></p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <div className="flex items-center gap-2">
                                    <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
                                    <p className="text-sm md:text-base">{displayStatus(order.status)}</p>
                                </div>
                                <button type="button" disabled={trackingLoading === order._id} onClick={() => toggleTracking(order._id)} className="border px-4 py-2 text-sm font-medium rounded-sm cursor-pointer disabled:opacity-50">
                                    {trackingLoading === order._id ? 'Refreshing...' : trackingOrderId === order._id ? 'Hide Tracking' : 'Track Order'}
                                </button>
                            </div>
                            {trackingOrderId === order._id && (
                                <div className="w-full border-t pt-3">
                                    {displayStatus(order.status) === 'Cancelled' ? <p className="text-red-600">This order has been cancelled.</p> : (
                                        <div className="flex flex-wrap gap-3">
                                            {statusSteps.map((step, stepIndex) => (
                                                <div key={step} className={`flex items-center gap-2 text-sm ${stepIndex <= getStatusIndex(order.status) ? 'text-green-700 font-medium' : 'text-gray-400'}`}>
                                                    <span className={`w-2 h-2 rounded-full ${stepIndex <= getStatusIndex(order.status) ? 'bg-green-600' : 'bg-gray-300'}`} />
                                                    {step}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                )))}
            </div>
        </div>
    )
}
export default Orders;