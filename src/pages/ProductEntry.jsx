// src/components/ProductEntry.jsx or src/pages/ProductEntry.jsx
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { Plus, Upload, X, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { productAPI } from "@/services/api";

// Validation schema
const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  originalPrice: z.number().optional().nullable(),
  sku: z.string().min(1, "SKU is required"),
  stockQuantity: z.number().min(0, "Stock quantity cannot be negative"),
  color: z.string().optional().nullable(),
  size: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  isFeatured: z.boolean().default(false),
  inStock: z.boolean().default(true),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().min(0).optional(),
  badge: z.string().optional().nullable(),
  categoryId: z.string().uuid("Please select a valid category"),
});

const ProductEntry = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      rating: 0,
      reviewCount: 0,
      isFeatured: false,
      inStock: true,
      stockQuantity: 0,
    },
  });

  const inStock = watch("inStock");

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      console.log('Categories fetched:', data);
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setApiError("Failed to load categories. Please check your API connection.");
      setCategories([]);
    }
  };

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    
    if (imageFiles.length === 0) {
      toast.error("Please upload image files only");
      return;
    }

    if (imageFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setIsUploading(true);
    
    // Convert files to base64
    const uploadPromises = imageFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve(reader.result);
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(uploadPromises).then((base64Images) => {
      setImagePreviews(prev => [...prev, ...base64Images]);
      setIsUploading(false);
      toast.success(`Added ${imageFiles.length} image(s)`);
    });
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (imagePreviews.length === 0) {
      toast.error("Please upload at least one product image");
      return;
    }

    // Check if categories are loaded
    if (categories.length === 0) {
      toast.error("Categories not loaded. Please refresh the page.");
      return;
    }

    try {
      setIsLoading(true);
      setApiError(null);
      
      // Prepare product data for API
      const productData = {
        ...data,
        images: imagePreviews,
        // Convert undefined/null to null for API
        originalPrice: data.originalPrice || null,
        color: data.color || null,
        size: data.size || null,
        material: data.material || null,
        brand: data.brand || null,
        badge: data.badge || null,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
      };

      console.log('Submitting product data:', productData);

      // Send to API
      const result = await productAPI.createProduct(productData);
      
      console.log('Product created successfully:', result);
      toast.success("Product added successfully!");
      
      // Reset form
      reset();
      setImagePreviews([]);
      
      // Navigate to product management
      navigate("/admin/products");
      
    } catch (error) {
      console.error("Error creating product:", error);
      const errorMessage = error.response?.data || error.message || "Failed to create product";
      setApiError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold mb-2">Add New Product</h1>
          <p className="text-muted-foreground">Fill in the details below to add a new product to your store</p>
        </div>

        {/* API Error Alert */}
        {apiError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {apiError}
              <br />
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal"
                onClick={() => {
                  setApiError(null);
                  fetchCategories();
                }}
              >
                Retry loading categories
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Debug Info */}
        <div className="mb-4 p-3 bg-secondary rounded-lg text-sm">
          <div className="font-medium mb-1">Debug Info:</div>
          <div>Categories loaded: {categories.length}</div>
          <div>API Base URL: https://localhost:7231/api</div>
          <div>Check browser console for detailed API logs</div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image & Basic Info */}
            <div className="space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                  <CardDescription>Upload up to 5 product images</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image Previews */}
                    {imagePreviews.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload Area */}
                    <label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isUploading ? "border-primary/50" : "border-border hover:border-primary/50"
                    }`}>
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                          <Loader2 className="w-10 h-10 mb-4 text-primary animate-spin" />
                        ) : (
                          <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
                        )}
                        <p className="mb-2 text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          PNG, JPG, WebP up to 5MB each
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {imagePreviews.length}/5 images
                        </p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        disabled={isUploading || imagePreviews.length >= 5}
                      />
                    </label>
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Essential product details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Leather Executive Watch"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        placeholder="LUX-WATCH-001"
                        {...register("sku")}
                      />
                      {errors.sku && (
                        <p className="text-sm text-destructive">{errors.sku.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="categoryId">Category *</Label>
                      <Select 
                        onValueChange={(value) => setValue("categoryId", value)}
                        disabled={categories.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={
                            categories.length === 0 
                              ? "Loading categories..." 
                              : "Select a category"
                          } />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.length === 0 ? (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.categoryId && (
                        <p className="text-sm text-destructive">{errors.categoryId.message}</p>
                      )}
                      {categories.length === 0 && (
                        <p className="text-sm text-amber-600">
                          Categories not loaded. Check API connection.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($) *</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="299.99"
                        {...register("price", { valueAsNumber: true })}
                      />
                      {errors.price && (
                        <p className="text-sm text-destructive">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="originalPrice">Original Price ($)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        step="0.01"
                        placeholder="399.99"
                        {...register("originalPrice", { valueAsNumber: true })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Additional Details */}
            <div className="space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                  <CardDescription>Detailed product description</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="description">Product Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your product in detail..."
                      className="min-h-[150px]"
                      {...register("description")}
                    />
                    {errors.description && (
                      <p className="text-sm text-destructive">{errors.description.message}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Additional Information</CardTitle>
                  <CardDescription>Extra product details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        placeholder="e.g., Luxe, AudioLuxe"
                        {...register("brand")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        placeholder="e.g., Black, Silver"
                        {...register("color")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="size">Size</Label>
                      <Input
                        id="size"
                        placeholder="e.g., M, 42mm"
                        {...register("size")}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="material">Material</Label>
                      <Input
                        id="material"
                        placeholder="e.g., Leather, Aluminum"
                        {...register("material")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stockQuantity">Stock Quantity *</Label>
                      <Input
                        id="stockQuantity"
                        type="number"
                        placeholder="45"
                        {...register("stockQuantity", { valueAsNumber: true })}
                      />
                      {errors.stockQuantity && (
                        <p className="text-sm text-destructive">{errors.stockQuantity.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="badge">Badge</Label>
                      <Input
                        id="badge"
                        placeholder="e.g., Best Seller, New, Sale"
                        {...register("badge")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating (0-5)</Label>
                      <Input
                        id="rating"
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        placeholder="4.8"
                        {...register("rating", { valueAsNumber: true })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reviewCount">Review Count</Label>
                      <Input
                        id="reviewCount"
                        type="number"
                        min="0"
                        placeholder="124"
                        {...register("reviewCount", { valueAsNumber: true })}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="isFeatured" className="text-base font-medium">
                          Featured Product
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Show this product in featured section
                        </p>
                      </div>
                      <Switch
                        id="isFeatured"
                        onCheckedChange={(checked) => setValue("isFeatured", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <Label htmlFor="inStock" className="text-base font-medium">
                          In Stock
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {inStock ? "Product is available for purchase" : "Product is out of stock"}
                        </p>
                      </div>
                      <Switch
                        id="inStock"
                        checked={inStock}
                        onCheckedChange={(checked) => setValue("inStock", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      variant="gold"
                      size="lg"
                      className="flex-1"
                      disabled={isLoading || isUploading || categories.length === 0}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Adding Product...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2 h-5 w-5" />
                          Add Product
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        reset();
                        setImagePreviews([]);
                        setApiError(null);
                      }}
                      disabled={isLoading || isUploading}
                    >
                      Reset Form
                    </Button>
                  </div>
                  
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>All fields marked with * are required</p>
                    {categories.length === 0 && (
                      <p className="text-amber-600">Categories must be loaded before submitting</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEntry;