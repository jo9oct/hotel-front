import React, { useState,useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { FaPlus, FaEdit, FaTrash, FaUtensils } from 'react-icons/fa';
import { foodData } from '@/types/food';
import {Loader1} from "@/lib/Loader"
import {  PulseLoader } from "react-spinners";

export const AdminDashboard: React.FC = () => {

  const {  addMenuItem,getMenuItem,Food, updateMenuItem, deleteMenuItem, loading } = useStore();
  const { toast } = useToast();
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<foodData | null>(null);
  const [ID,setID] = useState <string>()
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    price: number | null;
    image: string;
    category: string;
  }>({
    name: '',
    description: '',
    price: null,
    image: '',
    category: ''
  });

  useEffect(() => {
    const FetchFood = async () =>{
      await getMenuItem()
    }
    FetchFood()
  },[])

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: null,
      image: '',
      category: ''
    });
    setIsAddingItem(false);
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.price || !formData.image || !formData.category) {
      toast({
        title: "Item Added",
        description: `all fields are req.`,
      });
    }

    if(editingItem !== null){
      await updateMenuItem(formData.name,
                  String(formData.price || "0"),
                  formData.description,
                  formData.image,
                  formData.category || "Main Course",
                  ID || ""
      )
      window.location.reload();
      toast({
        title: "Item Updated",
        description: `Menu Updated Successfully.`,
      });
    }
    else{
      await addMenuItem(formData.name,
                  String(formData.price || "0"),
                  formData.description,
                  formData.image,
                  formData.category || "Main Course"
      )
      window.location.reload();
      toast({
        title: "Item Added",
        description: `Menu Added Successfully.`,
      });
    }

    resetForm();
  };

  const handleEdit = (item: foodData) => {
    setEditingItem(item);
    setFormData({
      name: item.FoodName,
      description: item.Description,
      price: item.Price,
      image: item.ImageURL,
      category: item.Category || ''
    });
    setID(item._id)
    setIsAddingItem(true);
    const element = document.getElementById("up");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" }); // Smooth scroll
    }
  };

  const handleDelete = async (item: foodData) => {
    await deleteMenuItem(item._id)
    window.location.reload();
    toast({
      title: "Item Deleted",
      description: `Menu Deleted Successfully.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-cream to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 md:gap-0">
          {/* Title */}
          <div className="text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Menu <span className="text-gold">Management</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Add, edit, and manage your restaurant menu items
            </p>
          </div>

          {/* Add Button */}
          <div className="flex justify-center md:justify-end">
            <Button 
              id='up'
              variant="gold" 
              size="lg"
              onClick={() => setIsAddingItem(true)}
              className="flex items-center gap-2"
            >
              <FaPlus className="w-4 h-4" />
              Add New Item
            </Button>
          </div>
        </div>

        {(isAddingItem || editingItem) && (
          <Card className="mb-8" >
            <CardHeader>
              <CardTitle>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
              </CardTitle>
              <CardDescription>
                {editingItem ? 'Update the details below' : 'Fill in the details for the new menu item'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Food Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Truffle Risotto"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={formData.price ?? ''}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || null})}
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the dish..."
                    rows={3}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="e.g., Main Course, Appetizer, Dessert"
                    />
                  </div>
                </div>
                
                <div className="flex gap-4 pt-4">
                  {/* Primary button: loader or submit */}
                  <div className="flex-1 flex justify-center">
                    {loading ? (
                      <PulseLoader color="#6EE7B7" size={10} margin={5} />
                    ) : (
                      <Button type="submit" variant="gold" size="lg" className="w-full">
                        {editingItem ? 'Update Item' : 'Add Item'}
                      </Button>
                    )}
                  </div>

                  {/* Cancel button */}
                  <div className="flex-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-full"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>

              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <Loader1 />
          ) : Food.length > 0 ? (
          Array.isArray(Food) &&
          Food.map((item) => (
            <Card className="overflow-hidden">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.ImageURL}
                  alt="Post Image"
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg text-foreground">{item.FoodName}</h3>
                  <span className="text-lg font-bold text-gold">{item.Price} Birr</span>
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
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="flex-1"
                  >
                    <FaEdit className="mr-1" />
                    Update
                  </Button>

                  <div className="flex-1 flex justify-center">
                    {loading ? (
                      <PulseLoader color="#6EE7B7" size={10} margin={5} />
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="flex-1"
                      >
                        <FaTrash className="mr-1" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
          ) : (
            <div className="text-center py-16 w-[80vw]">
              <FaUtensils className="text-6xl text-muted-foreground/30 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                No menu items yet
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Start by adding your first menu item
              </p>
              <Button 
                variant="gold" 
                size="lg"
                onClick={() => setIsAddingItem(true)}
              >
                <FaPlus className="mr-2" />
                Add First Item
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};