import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Plus, 
  Upload, 
  FolderOpen, 
  Image as ImageIcon, 
  Trash2, 
  Edit, 
  Eye,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Package,
  DollarSign,
  Tag,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" or "list"
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const itemsPerPage = 12;

  // Sample categories
  const categories = [
    "All",
    "Electronics",
    "Accessories",
    "Bags",
    "Home",
    "Clothing",
    "Shoes",
    "Beauty"
  ];

  // Sample initial products
  const sampleProducts = [
    {
      id: "1",
      name: "Leather Executive Watch",
      price: 299,
      category: "Accessories",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400&h=400&fit=crop",
      stock: 45,
      status: "active",
      createdAt: "2024-01-15",
      rating: 4.8
    },
    {
      id: "2",
      name: "Wireless Pro Headphones",
      price: 349,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
      stock: 23,
      status: "active",
      createdAt: "2024-01-20",
      rating: 4.9
    },
    {
      id: "3",
      name: "Minimalist Backpack",
      price: 189,
      category: "Bags",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
      stock: 0,
      status: "out-of-stock",
      createdAt: "2024-01-10",
      rating: 4.7
    }
  ];

  // Load sample products on mount
  useEffect(() => {
    setProducts(sampleProducts);
  }, []);

  // Handle folder selection
  const handleFolderSelect = (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      toast.error("No image files found in the selected folder");
      return;
    }

    setSelectedFiles(imageFiles);
    toast.success(`Selected ${imageFiles.length} image files`);
  };

  // Simulate bulk upload
  const handleBulkUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select files first");
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate API call
    setTimeout(() => {
      clearInterval(interval);
      
      // Create new products from uploaded images
      const newProducts = selectedFiles.map((file, index) => ({
        id: `new-${Date.now()}-${index}`,
        name: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        price: Math.floor(Math.random() * 500) + 50,
        category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1],
        image: URL.createObjectURL(file),
        stock: Math.floor(Math.random() * 100),
        status: Math.random() > 0.3 ? "active" : "draft",
        createdAt: new Date().toISOString().split('T')[0],
        rating: (Math.random() * 1 + 4).toFixed(1)
      }));

      setProducts([...newProducts, ...products]);
      setSelectedFiles([]);
      setUploadProgress(0);
      setLoading(false);
      
      toast.success(`Successfully uploaded ${selectedFiles.length} products`);
    }, 3000);
  };

  // Handle delete product
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Product deleted successfully");
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Get stats
  const totalProducts = products.length;
  const activeProducts = products.filter(p => p.status === "active").length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Product Management</h1>
              <p className="text-muted-foreground">Manage your products, upload in bulk, and track inventory</p>
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
                    <p className="text-sm text-muted-foreground">Total Products</p>
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
                    <p className="text-sm text-muted-foreground">Active Products</p>
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
                    <p className="text-sm text-muted-foreground">Out of Stock</p>
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
                    <p className="text-sm text-muted-foreground">Inventory Value</p>
                    <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
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
                <CardDescription>Upload multiple product images at once</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Folder Upload */}
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">
                      Select a folder containing product images
                    </p>
                    <input
                      type="file"
                      id="folder-upload"
                      webkitdirectory="true"
                      directory="true"
                      multiple
                      onChange={handleFolderSelect}
                      className="hidden"
                      accept="image/*"
                    />
                    <label htmlFor="folder-upload">
                      <Button variant="outline" as="span">
                        <Upload className="mr-2 h-4 w-4" />
                        Select Folder
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
                          <div key={index} className="relative aspect-square rounded overflow-hidden">
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
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
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
                    <li>• Use clear product images</li>
                    <li>• Image names will become product names</li>
                    <li>• Supported formats: JPG, PNG, WebP</li>
                    <li>• Max 50 images per upload</li>
                    <li>• Products will be created as drafts</li>
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
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-[140px]">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
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
                {viewMode === "grid" ? (
                  // Grid View
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {paginatedProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                        <div className="relative aspect-square overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Badge variant={product.status === "active" ? "default" : "secondary"}>
                              {product.status}
                            </Badge>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="font-semibold truncate">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.category}</p>
                            </div>
                            <span className="font-bold">${product.price}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Tag className="h-3 w-3" />
                              <span>SKU: {product.id}</span>
                            </div>
                            <span className={product.stock > 0 ? "text-green-600" : "text-destructive"}>
                              Stock: {product.stock}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-3 w-3 mr-1" />
                              Edit
                            </Button>
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
                        {paginatedProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded overflow-hidden">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">SKU: {product.id}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="font-semibold">${product.price}</TableCell>
                            <TableCell>
                              <span className={product.stock > 0 ? "text-green-600" : "text-destructive"}>
                                {product.stock}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge variant={product.status === "active" ? "default" : "secondary"}>
                                {product.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteProduct(product.id)}
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-muted-foreground">
                      Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                      {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
                      {filteredProducts.length} products
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <Button
                            key={pageNum}
                            variant={currentPage === pageNum ? "secondary" : "outline"}
                            size="icon"
                            onClick={() => setCurrentPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No products found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || selectedCategory !== "all" 
                        ? "Try adjusting your search or filters"
                        : "Upload your first products using the bulk upload tool"}
                    </p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}>
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