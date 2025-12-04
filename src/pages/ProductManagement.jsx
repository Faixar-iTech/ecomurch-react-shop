// src/components/ProductManagement.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Upload,
  FolderOpen,
  Trash2,
  Edit,
  Eye,
  Search,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Package,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { productAPI } from "@/services/api";
import ImageDisplay from "@/components/ui/image-display";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const itemsPerPage = 12;

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productAPI.getAllProducts({
        page: currentPage,
        pageSize: itemsPerPage,
      });
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Handle folder selection for bulk upload
  const handleFolderSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("No image files found in the selected folder");
      return;
    }

    setSelectedFiles(imageFiles);
    toast.success(`Selected ${imageFiles.length} image files`);
  };

  // Bulk upload products
  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Create products from uploaded images
      const uploadPromises = selectedFiles.map(async (file, index) => {
        // Convert file to base64
        const base64Image = await convertFileToBase64(file);

        // Find a suitable category (default to first category)
        const defaultCategoryId =
          categories.length > 0 ? categories[0].id : null;

        // Create product data
        const productData = {
          name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
          description: `Premium ${file.name
            .replace(/\.[^/.]+$/, "")
            .replace(/[-_]/g, " ")} product`,
          price: Math.floor(Math.random() * 500) + 50,
          originalPrice: Math.floor(Math.random() * 500) + 100,
          sku: `LUX-${Date.now()}-${index}`,
          stockQuantity: Math.floor(Math.random() * 100),
          color: ["Black", "White", "Silver", "Gold", "Navy"][
            Math.floor(Math.random() * 5)
          ],
          material: ["Leather", "Metal", "Cotton", "Silk", "Wool"][
            Math.floor(Math.random() * 5)
          ],
          brand: "Luxe",
          images: [base64Image],
          isFeatured: Math.random() > 0.7,
          inStock: true,
          rating: (Math.random() * 1 + 4).toFixed(1),
          reviewCount: Math.floor(Math.random() * 100),
          badge: Math.random() > 0.5 ? "New" : "Best Seller",
          categoryId:
            defaultCategoryId || "11111111-1111-1111-1111-111111111111",
        };

        return productAPI.createProduct(productData);
      });

      // Update progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Execute all uploads
      await Promise.all(uploadPromises);

      clearInterval(interval);
      setUploadProgress(100);

      // Refresh products list
      await fetchProducts();

      setSelectedFiles([]);
      toast.success(`Successfully uploaded ${selectedFiles.length} products`);
    } catch (error) {
      console.error("Bulk upload error:", error);
      toast.error("Failed to upload products");
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await productAPI.deleteProduct(productId);
      setProducts(products.filter((p) => p.id !== productId));
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      searchQuery === "" ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.categoryName &&
        product.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === "all" ||
      (product.categoryName && product.categoryName === selectedCategory);

    return matchesSearch && matchesCategory;
  });

  // Get stats
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.isActive).length;
  const outOfStockProducts = products.filter(
    (p) => !p.inStock || p.stockQuantity === 0
  ).length;
  const totalValue = products.reduce(
    (sum, p) => sum + p.price * p.stockQuantity,
    0
  );

  // Category options for filter
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((cat) => ({
      value: cat.name,
      label: cat.name,
    })),
  ];

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">
                Product Management
              </h1>
              <p className="text-muted-foreground">
                Manage your products, upload in bulk, and track inventory
              </p>
            </div>
            <Button variant="gold" asChild>
              <Link to="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Single Product
              </Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Products
                    </p>
                    <p className="text-2xl font-bold">{totalProducts}</p>
                  </div>
                  <Package className="h-10 w-10 text-primary/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Products
                    </p>
                    <p className="text-2xl font-bold">{activeProducts}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-500/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Out of Stock
                    </p>
                    <p className="text-2xl font-bold">{outOfStockProducts}</p>
                  </div>
                  <XCircle className="h-10 w-10 text-destructive/20" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Inventory Value
                    </p>
                    <p className="text-2xl font-bold">
                      ${totalValue.toLocaleString()}
                    </p>
                  </div>
                  <DollarSign className="h-10 w-10 text-gold/20" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Bulk Upload</CardTitle>
                <CardDescription>
                  Upload multiple product images at once
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a folder containing product images
                    </p>
                    <input
                      type="file"
                      id="folder-upload"
                      multiple
                      onChange={handleFolderSelect}
                      className="hidden"
                      accept="image/*"
                    />
                    <label htmlFor="folder-upload">
                      <Button variant="outline" as="span">
                        <Upload className="mr-2 h-4 w-4" />
                        Select Images
                      </Button>
                    </label>
                  </div>

                  {/* Selected Files Preview */}
                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        Selected: {selectedFiles.length} files
                      </p>
                      <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
                        {selectedFiles.slice(0, 8).map((file, index) => (
                          <div
                            key={index}
                            className="relative aspect-square rounded overflow-hidden"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {selectedFiles.length > 8 && (
                          <div className="aspect-square rounded bg-secondary flex items-center justify-center">
                            <span className="text-xs font-medium">
                              +{selectedFiles.length - 8}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Upload Button */}
                  <Button
                    variant="gold"
                    className="w-full"
                    onClick={handleBulkUpload}
                    disabled={selectedFiles.length === 0 || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload {selectedFiles.length} Products
                      </>
                    )}
                  </Button>
                </div>

                {/* Upload Tips */}
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Upload Tips:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Use clear product images (square recommended)</li>
                    <li>• Image names will become product names</li>
                    <li>• Supported formats: JPG, PNG, WebP</li>
                    <li>• Max 50 images per upload</li>
                    <li>• Products will be created as active</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Products List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Product List</CardTitle>
                    <CardDescription>
                      {filteredProducts.length} products found
                    </CardDescription>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* View Mode Toggle */}
                    <div className="flex border rounded-lg p-1">
                      <Button
                        variant={viewMode === "grid" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "secondary" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Category Filter */}
                    <Select
                      value={selectedCategory}
                      onValueChange={setSelectedCategory}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>

              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading products...</span>
                  </div>
                ) : viewMode === "grid" ? (
                  // Grid View
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="overflow-hidden group hover:shadow-lg transition-shadow"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          {product.images && product.images.length > 0 ? (
                            <ImageDisplay
                              images={product.images}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              fallbackClassName="aspect-square"
                            />
                          ) : (
                            <div className="w-full h-full bg-secondary flex items-center justify-center">
                              <Package className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Badge
                              variant={
                                product.isActive ? "default" : "secondary"
                              }
                            >
                              {product.isActive ? "Active" : "Inactive"}
                            </Badge>
                            {product.badge && (
                              <Badge
                                variant="outline"
                                className="bg-background/80 backdrop-blur-sm"
                              >
                                {product.badge}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold truncate">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {product.categoryName}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold">
                                ${product.price.toFixed(2)}
                              </span>
                              {product.isOnSale && (
                                <span className="block text-sm line-through text-muted-foreground">
                                  ${product.originalPrice?.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Tag className="h-3 w-3" />
                              <span>SKU: {product.sku}</span>
                            </div>
                            <span
                              className={
                                product.inStock
                                  ? "text-green-600"
                                  : "text-destructive"
                              }
                            >
                              Stock: {product.stockQuantity}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Link
                              to={`/products/${product.id}`}
                              className="flex-1"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            </Link>
                            <Link
                              to={`/admin/products/edit/${product.id}`}
                              className="flex-1"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full"
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  // Table View
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded overflow-hidden">
                                  {product.images &&
                                  product.images.length > 0 ? (
                                    <img
                                      src={product.images[0]}
                                      alt={product.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-full w-full bg-secondary flex items-center justify-center">
                                      <Package className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    SKU: {product.sku}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {product.categoryName}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div>
                                <span className="font-semibold">
                                  ${product.price.toFixed(2)}
                                </span>
                                {product.isOnSale && (
                                  <span className="block text-xs line-through text-muted-foreground">
                                    ${product.originalPrice?.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  product.inStock
                                    ? "text-green-600"
                                    : "text-destructive"
                                }
                              >
                                {product.stockQuantity}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  product.isActive ? "default" : "secondary"
                                }
                              >
                                {product.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Link to={`/products/${product.id}`}>
                                  <Button variant="ghost" size="icon">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Link to={`/admin/products/edit/${product.id}`}>
                                  <Button variant="ghost" size="icon">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </Link>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteProduct(product.id)
                                  }
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* Empty State */}
                {!loading && filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">
                      No products found
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || selectedCategory !== "all"
                        ? "Try adjusting your search or filters"
                        : "Upload your first products using the bulk upload tool"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
