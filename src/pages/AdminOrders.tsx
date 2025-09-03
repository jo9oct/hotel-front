import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { FaClipboardList, FaClock, FaCheck, FaTruck } from 'react-icons/fa';
import { ChevronLeft, Trash2 } from "lucide-react";
import {formatDate} from "@/lib/utils"
import {Loader1} from "@/lib/Loader"
import {  PulseLoader } from "react-spinners";

export const AdminOrders: React.FC = () => {
  const {updateStatus,getOrder,deleteOrder,Order, loading} = useStore()
  // const { orders } = useStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      await getOrder();
    };
    fetchOrders();
  },[])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    if (newStatus === "pending"){
      updateStatus(orderId, "preparing");
      window.location.reload();
    }
    else if (newStatus === "preparing"){
      updateStatus(orderId, "delivered");
      window.location.reload();
    }
    
    toast({
      title: "Order Status Updated",
      description: `Order has been marked as ${newStatus}.`,
    });
  };

  const StatusTrackBack = async (orderId: string, newStatus: string) => {
    if (newStatus === "preparing"){
      await updateStatus(orderId, "pending");
      window.location.reload();
    }
    else if (newStatus === "delivered"){
      await updateStatus(orderId, "preparing");
      window.location.reload();
    }
    
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <FaClock className="text-orange-500" />;
      case 'preparing':
        return <FaTruck className="text-blue-500" />;
      case 'delivered':
        return <FaCheck className="text-green-500" />;
      default:
        return <FaClock />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'preparing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const DeleteOrder = async (orderId: string) => {
    await deleteOrder(orderId)
    window.location.reload();
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
            Track and manage customer orders in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <Loader1 />
          ) : Order.length > 0 ? (
            Array.isArray(Order) && 
          Order.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-foreground">
                    {order.OrderType} {order.OrderNumber}
                  </CardTitle>
                  <Badge className={`${getStatusColor(order.OrderStatus)} flex items-center gap-1`}>
                    {getStatusIcon(order.OrderStatus)}
                    {order.OrderStatus.charAt(0).toUpperCase() + order.OrderStatus.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate((order.createdAt))}
                </p>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {Array.isArray(order.Foods) && 
                order.Foods.map((food, index) => (
                  <div key={index} className="flex gap-3">
                    <img
                      src={food.ImageURL}
                      alt={food.FoodName}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {food.FoodName}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {food.Description}
                      </p>
                      <p className="text-lg font-bold text-gold mt-1">
                        {food.Price} Birr
                      </p>
                    </div>
                  </div>
                ))}

                {/* total pay  */}
                <div className="mt-4 p-3 bg-gray-50 rounded-md flex justify-between items-center shadow-sm">
                  <span className="text-gray-600 font-medium">Total Amount:</span>
                  <span className="text-foreground font-bold text-lg">
                    {order.Foods.reduce((sum, item) => sum + item.Price, 0).toFixed(2)} Birr
                  </span>
                </div>
                
                <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-lg">
      
                  {/* Back Icon */}
                  <div
                    className={`flex-shrink-0 inline-flex items-center justify-center p-3 rounded-full 
                      ${order.OrderStatus === "pending" 
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 cursor-pointer shadow-md transition-all duration-300 hover:scale-110"
                      }`}
                    onClick={() => StatusTrackBack(order._id, order.OrderStatus) }
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </div>

                  {/* Status Buttons */}
                  <div className="flex-1 flex flex-col gap-2">
                    {loading ? (
                      <PulseLoader color="#6EE7B7" size={10} margin={5} />
                      ) : (
                        <>
                          {order.OrderStatus === 'pending' && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full flex items-center justify-center gap-2 border-gray-300 hover:border-gray-400"
                              onClick={() => handleStatusUpdate(order._id, order.OrderStatus)}
                            >
                              <FaTruck className="w-4 h-4" />
                              Mark as Preparing
                            </Button>
                          )}
                        </>
                    )}

                    {loading ? (
                      <PulseLoader color="#6EE7B7" size={10} margin={5} />
                    ) : (
                      <>
                        {order.OrderStatus === 'preparing' && (
                          <Button
                            variant="gold"
                            size="sm"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => handleStatusUpdate(order._id, order.OrderStatus)}
                          >
                            <FaCheck className="w-4 h-4" />
                            Mark as Delivered
                          </Button>
                        )}
                      </>
                    )}

                    {order.OrderStatus === 'delivered' && (
                      <div
                        className="text-center py-2 bg-green-50 text-green-700 font-semibold rounded-md cursor-default"
                      >
                        ✓ Order Complete
                      </div>
                    )}
                  </div>

                  {/* Delete Icon */}
                  <div
                    className="flex-shrink-0 inline-flex items-center justify-center p-3 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-800 cursor-pointer shadow-md transition-all duration-300 hover:scale-110"
                    onClick={() => DeleteOrder(order._id)}
                  >
                    <Trash2 className="w-5 h-5" />
                  </div>

                </div>
              </CardContent>
            </Card>
          ))
          ) : (
            <div className="text-center py-16 w-[80vw]">
              <FaClipboardList className="text-6xl text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                No orders yet
              </h2>
              <p className="text-xl text-muted-foreground">
                Orders will appear here when customers place them
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};