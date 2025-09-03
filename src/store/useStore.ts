import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from "../lib/axios";
import type { foodData } from "../types/food";
import type { orderData } from "../types/order";

export interface AppState {
  loading: boolean;
  Food: foodData[];
  Order: orderData[];
  menuItems: foodData[];
  orders: Order[];

  getMenuItem: () => Promise<void>;
  addMenuItem: (FoodName: string, Price: string, Description: string, ImageURL: string, Category: string) => Promise<void>;
  updateMenuItem: (FoodName: string, Price: string, Description: string, ImageURL: string, Category: string, ID: string) => Promise<void>;
  deleteMenuItem: (id: string) => Promise<void>;

  addOrder: (selectedFoods: foodData[], orderType: string, orderNumber: number, OrderStatus: string, id: number) => Promise<void>;
  getOrder: () => Promise<void>;
  updateStatus: (id: string, status: string) => Promise<void>;
  updateOrder: (selectedFoods: foodData[], orderType: string, orderNumber: number, OrderStatus: string, id: number, DBi_d: string) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export interface Order {
  id: string;
  menuItem: foodData;
  roomNumber: string;
  timestamp: Date;
  status: 'pending' | 'preparing' | 'delivered';
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      loading: false,
      menuItems: [],
      orders: [],
      Food: [],
      Order: [],

      // Menu functions
      getMenuItem: async () => {
        set({ loading: true });
        try {
          const res = await api.get("/food");
          set({ Food: res.data });
        } catch (error) {
          console.error("Error fetching menu items", error);
        } finally {
          set({ loading: false });
        }
      },

      addMenuItem: async (FoodName, Price, Description, ImageURL, Category) => {
        set({ loading: true });
        if (!FoodName || !Description || Price === null || !ImageURL) {
          console.error("All fields required");
          set({ loading: false });
          return;
        }
        try {
          await api.post("/food", { FoodName, Price: Number(Price), Description, ImageURL, Category });
          console.log("Item added successfully");
        } catch (error) {
          console.error("Error adding item", error);
        } finally {
          set({ loading: false });
        }
      },

      updateMenuItem: async (FoodName, Price, Description, ImageURL, Category, ID) => {
        set({ loading: true });
        if (!FoodName || !Description || Price === null || !ImageURL) {
          console.error("All fields required");
          set({ loading: false });
          return;
        }
        try {
          await api.put(`/food/${ID}`, { FoodName, Price: Number(Price), Description, ImageURL, Category });
          console.log("Item updated successfully");
        } catch (error) {
          console.error("Error updating item", error);
        } finally {
          set({ loading: false });
        }
      },

      deleteMenuItem: async (id: string) => {
        set({ loading: true });
        try {
          await api.delete(`/food/${id}`);
          console.log("Item deleted successfully");
        } catch (error) {
          console.error("Error deleting item", error);
        } finally {
          set({ loading: false });
        }
      },

      // Order functions
      addOrder: async (selectedFoods, orderType, orderNumber, OrderStatus, id) => {
        set({ loading: true });
        if (!Array.isArray(selectedFoods) || !orderType || !orderNumber || !id) {
          console.error("All fields required");
          set({ loading: false });
          return;
        }
        try {
          await api.post("/order", { Foods: selectedFoods, OrderType: orderType, OrderNumber: orderNumber, OrderStatus, OrderId: id });
          console.log("Order submitted successfully");
        } catch (error) {
          console.error("Error submitting order", error);
        } finally {
          set({ loading: false });
        }
      },

      getOrder: async () => {
        set({ loading: true });
        try {
          const res = await api.get("/order");
          set({ Order: res.data });
        } catch (error) {
          console.error("Error fetching orders", error);
        } finally {
          set({ loading: false });
        }
      },

      updateStatus: async (id, status) => {
        set({ loading: true });
        if (!status) {
          console.error("Status required");
          set({ loading: false });
          return;
        }
        try {
          await api.patch(`/order/${id}`, { OrderStatus: status });
          console.log("Order status updated successfully");
          window.location.reload();
        } catch (error) {
          console.error("Error updating status", error);
        } finally {
          set({ loading: false });
        }
      },

      updateOrder: async (selectedFoods, orderType, orderNumber, OrderStatus, id, DBi_d) => {
        set({ loading: true });
        if (!Array.isArray(selectedFoods) || !orderType || !orderNumber || !id) {
          console.error("All fields required");
          set({ loading: false });
          return;
        }
        try {
          await api.put(`/order/${DBi_d}`, { Foods: selectedFoods, OrderType: orderType, OrderNumber: orderNumber, OrderStatus, OrderId: id });
          console.log("Order updated successfully");
        } catch (error) {
          console.error("Error updating order", error);
        } finally {
          set({ loading: false });
        }
      },

      deleteOrder: async (id) => {
        set({ loading: true });
        try {
          await api.delete(`/order/${id}`);
          console.log("Order deleted successfully");
        } catch (error) {
          console.error("Error deleting order", error);
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: 'hotel-menu-storage',
      partialize: (state) => ({
        Food: state.Food,
        Order: state.Order,
      }),
    }
  )
);
