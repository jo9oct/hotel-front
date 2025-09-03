import React, { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import type { foodData } from "../types/food";
import { ShoppingCart, ChevronDown, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router-dom";
import {orderData} from "@/types/order"
import {Loader1} from "@/lib/Loader"
import {  PulseLoader } from "react-spinners";

export const Menu: React.FC = () => {
  const { getMenuItem, Food, addOrder , getOrder ,updateOrder , Order , loading} = useStore();

  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<foodData[]>([]); // full food items
  const [orderType, setOrderType] = useState(""); // chair or room
  const [orderNumber, setOrderNumber] = useState("");
  const [update,setUpdate] = useState (false)
  const [OrderId,setOrderId] = useState <Number>()
  const [DBi_d,setDB_id] = useState ("")
  
  const navigate=useNavigate()
  const location = useLocation();

  useEffect(() => {
    const FetchFood = async () => {
      await getMenuItem();
    };
    FetchFood();
  }, [getMenuItem]);

  useEffect(() => {
    const FetchOrder = async () => {
      await getOrder();
    };
    FetchOrder();
  },[])

  const UpdateOrder = (order: orderData) => {
    setOrderType(order.OrderType)
    setOrderNumber(order.OrderNumber.toString())
    setSelectedFoods(order.Foods)

    setOrderId(order.OrderId)
    setDB_id(order._id)
    setUpdate(true)
  };
  
  // Accept state from navigation
  const { state } = useLocation() as {
    state?: { callFunction?: boolean; functionParam?: orderData; Update?: boolean };
  };
  
  // Listen for state changes and trigger update
  useEffect(() => {
    if (state?.callFunction && state.Update && state.functionParam) {
      UpdateOrder(state.functionParam); // pass the order object
    }
  }, [state]);

  // Toggle Select / Selected
  const handleSelectToggle = (item: foodData) => {
    if (selectedFoods.find((f) => f._id === item._id)) {
      setSelectedFoods(selectedFoods.filter((f) => f._id !== item._id));
    } else {
      setSelectedFoods([...selectedFoods, item]);
    }
  };

  // Order button → popup open
  const handleOrderClick = () => {
    setIsOrderDialogOpen(true);
  };

// Confirm order
const handleOrderConfirm = async () => {

  if(update){
    await updateOrder(selectedFoods, orderType, Number(orderNumber), "pending", Number(OrderId),DBi_d);
    navigate("/favorites")
    window.location.reload();
  }
  else{
    let id: number;

    // Keep generating until we find a unique one
    do {
      id = Math.floor(Math.random() * 1000000);
    } while (Order.some(order => order.OrderId === id));
  
    // Add order once a unique ID is found
    await addOrder(selectedFoods, orderType, Number(orderNumber), "pending", id);

    const key=`order-${id}`
    localStorage.setItem(key ,  id.toString())

  }

  // reset after confirm
  setIsOrderDialogOpen(false);
  setOrderNumber("");
  setOrderType("");
  setSelectedFoods([]);
};

    // Calculate total
  const totalAmount = selectedFoods.reduce((sum, item) => sum + item.Price, 0).toFixed(2);


  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-warm-cream to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          {/* --- Top bar with Order button --- */}
          <div className="relative flex flex-col items-center mb-8 md:flex-row md:items-center">
            {/* Title Centered */}
            <h1 className="text-center text-3xl md:text-5xl font-bold text-foreground flex-1">
              Exquisite <span className="text-gold">Dining</span>
            </h1>

            {/* Order Button Right (on desktop), Centered (on mobile) */}
            <Button
              variant="default"
              size="lg"
              disabled={selectedFoods.length === 0}
              onClick={handleOrderClick}
              className="mt-4 md:mt-0 md:ml-auto flex items-center gap-2"
              title={selectedFoods.length === 0 ? "Please select at least one food" : ""}
            >
              <ShoppingCart className="h-5 w-5" />
              Order
            </Button>
          </div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-center mb-12">
            Savor the finest culinary creations delivered directly to your room
          </p>

          {/* --- Food grid --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {loading ? (
              <Loader1 />
            ) : Food.length > 0 ? (
              Array.isArray(Food) &&  
              Food.map((item) => (
                <Card key={item._id} className="overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={item.ImageURL}
                      alt={item.FoodName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        {item.FoodName}
                      </h3>
                      <span className="text-lg font-bold text-gold">
                        {item.Price} Birr
                      </span>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {item.Description}
                    </p>
                    {item.Category && (
                      <span className="inline-block px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-full mb-3">
                        {item.Category}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant={
                          selectedFoods.find((f) => f._id === item._id)
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleSelectToggle(item)}
                        className="flex-1"
                      >
                        {selectedFoods.find((f) => f._id === item._id) ? (
                          <>
                            <Check className="mr-1 h-4 w-4" />
                            Selected
                          </>
                        ) : (
                          <>
                            <ChevronDown className="mr-1 h-4 w-4" />
                            Select
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-16 w-[80vw]">
                <p className="text-xl text-muted-foreground">
                  No menu items available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Order Popup --- */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-2 mb-4">
            <h2 className="font-semibold">Selected Foods:</h2>
            <ul className="list-disc list-inside text-sm">
              {selectedFoods.map((food) => (
                <li key={food._id}>
                  {food.FoodName} - {food.Price} Birr
                </li>
              ))}
            </ul>
            <h4 className="text-lg font-semibold">
              Total: <span className="text-gold">{totalAmount} Birr</span>
            </h4>
          </div>

          <RadioGroup
            value={orderType}
            onValueChange={(value) => setOrderType(value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="chair" id="chair" />
              <Label htmlFor="chair">Chair Number</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="room" id="room" />
              <Label htmlFor="room">Room Number</Label>
            </div>
          </RadioGroup>

          {orderType && (
            <Input
              type="number"
              placeholder={
                orderType === "chair" ? "Enter Chair Number" : "Enter Room Number"
              }
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="mt-4"
            />
          )}

          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOrderDialogOpen(false)}>
              Cancel
            </Button>
            {loading ? (
              <PulseLoader color="#6EE7B7" size={10} margin={5} />
            ) : (
              <>
              <Button
                variant="default"
                disabled={!orderType || !orderNumber}
                onClick={handleOrderConfirm}
              >
                Order Now
              </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
};
