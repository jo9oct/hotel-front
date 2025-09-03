import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FaClipboardList, FaClock, FaCheck, FaTruck } from 'react-icons/fa';
import { Trash2, Edit } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useStore } from "@/store/useStore";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import {orderData} from "@/types/order"
import {Loader1} from "@/lib/Loader"

export const MyOrder: React.FC = () => {
  const { getOrder, Order,deleteOrder, loading } = useStore();
  const { toast } = useToast();
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const navigate=useNavigate()

  useEffect(() => {
    const fetchOrders = async () => {
      await getOrder();
    }
    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders by checking if the localStorage contains the order's ID
    const matchedOrders = Order.filter(order => {
      const key = `order-${order.OrderId || order._id}`; // match your storage key format
      return localStorage.getItem(key) !== null;
    });

    setFilteredOrders(matchedOrders);
  }, [Order]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending': return <FaClock />;
      case 'preparing': return <FaTruck />;
      case 'delivered': return <FaCheck />;
      default: return null;
    }
  };

  const formatStatus = (status?: string) => status ? status.charAt(0).toUpperCase() + status.slice(1) : "";

  // Function to update order and navigate to home
  const CallUpdateFunction = (order: orderData) => {
    navigate("/", {
      state: {
        callFunction: true,
        functionParam: order, // 👈 Pass the order object
        Update: true
      }
    });
  };

  const DeleteOrder = async (orderId: string) => {

      await deleteOrder(orderId)
      window.location.reload();
      toast({
        title: "Order Deleted Successfully",
        description: "you are delete the current order"
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FaClipboardList className="text-gold text-3xl" />
            <h1 className="text-4xl font-bold text-foreground">
              Order <span className="text-gold">Management</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            View and Update Your Current Order
          </p>
          <p className="text-md text-muted-foreground">
            You can modify the order only before it has started
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <Loader1 />
          ) : filteredOrders.length > 0 ? (
            Array.isArray(filteredOrders) &&
           filteredOrders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">
                    {order.OrderType} {order.OrderNumber}
                  </CardTitle>
                  <Badge className={`${getStatusColor(order.OrderStatus)} flex items-center gap-1`}>
                    {getStatusIcon(order.OrderStatus)}
                    {formatStatus(order.OrderStatus)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(order.createdAt)}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                {order.Foods.map((food: any, index: number) => (
                  <div key={index} className="flex gap-3">
                    <img
                      src={food.ImageURL}
                      alt={food.FoodName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">{food.FoodName}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">{food.Description}</p>
                      <p className="text-lg font-bold text-gold mt-1">{food.Price} Birr</p>
                    </div>
                  </div>
                ))}

                <div className="mt-4 p-3 bg-gray-50 rounded-md flex justify-between items-center shadow-sm">
                  <span className="text-gray-600 font-medium">Total Amount:</span>
                  <span className="text-foreground font-bold text-lg">
                    {order.Foods.reduce((sum: number, item: any) => sum + item.Price, 0).toFixed(2)} Birr
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  {/* Status Button */}
                  <div className="flex-1">
                    {order.OrderStatus === 'pending' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
                        onClick={() => CallUpdateFunction(order)}
                      >
                        <Edit className="w-4 h-4" />
                        Update Order
                      </Button>
                    )}
                  </div>

                  {/* Delete Icon */} 
                  {order.OrderStatus === 'pending' && (
                    <div
                      className="flex-shrink-0 inline-flex items-center justify-center p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 cursor-pointer shadow-md transition-all duration-300 hover:scale-110"
                      onClick={() => DeleteOrder(order._id)}
                    >
                      <Trash2 className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {order.OrderStatus !== 'pending' && (
                  <div
                    className="text-center py-2 bg-green-50 text-green-700 font-semibold rounded-md cursor-default"
                  >
                    ✓ Order {order.OrderStatus}
                  </div>
                )}
              </CardContent>
            </Card>
          ))) : (
            <div className="flex flex-col justify-center items-center py-16 min-h-[50vh] w-[80vw] mx-auto text-center">
              <p className="text-2xl md:text-3xl font-semibold text-gray-600 dark:text-gray-300">
                You don't have any orders at the moment.
              </p>
              <p className="mt-4 text-gray-400 dark:text-gray-500">
                Browse our menu and place your first order!
              </p>
              <Button
                variant="default"
                size="lg"
                onClick={() => navigate("/")}
                className="mt-6 flex items-center gap-2"
              >
                Our Menu
              </Button>
            </div>

          )}
        </div>
      </div>
    </div>
  );
};
