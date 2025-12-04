// src/components/APIDebugger.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, RefreshCw, AlertCircle, Globe } from 'lucide-react';
import { productAPI } from '@/services/api';

const APIDebugger = () => {
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [data, setData] = useState({ categories: [], products: [] });
  const [apiInfo, setApiInfo] = useState({
    url: 'https://localhost:7231/api',
    corsEnabled: false,
    serverRunning: false
  });

  const testAPI = async () => {
    setStatus('testing');
    setError(null);
    
    try {
      console.log('🔍 Testing API connection...');
      
      // Test 1: Check if API server is reachable
      console.log('[1] Testing API server reachability...');
      const startTime = Date.now();
      
      // Test categories endpoint
      const categories = await productAPI.getCategories();
      const categoriesTime = Date.now() - startTime;
      
      console.log('[1] ✅ API server reachable');
      console.log(`    Response time: ${categoriesTime}ms`);
      console.log(`    Categories received: ${Array.isArray(categories) ? categories.length : 'N/A'}`);
      
      // Test 2: Products endpoint
      console.log('[2] Testing products endpoint...');
      const products = await productAPI.getAllProducts();
      console.log('[2] ✅ Products endpoint working');
      console.log(`    Products received: ${Array.isArray(products) ? products.length : 'N/A'}`);
      
      setData({
        categories: Array.isArray(categories) ? categories : [],
        products: Array.isArray(products) ? products : []
      });
      
      setApiInfo(prev => ({
        ...prev,
        serverRunning: true,
        corsEnabled: true
      }));
      
      setStatus('success');
      console.log('🎉 API connection successful!');
      
    } catch (error) {
      console.error('[ERROR] API connection failed:', error);
      setError({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        type: error.response ? 'api_error' : 'network_error'
      });
      
      setApiInfo(prev => ({
        ...prev,
        serverRunning: error.response ? true : false,
        corsEnabled: error.response ? true : false
      }));
      
      setStatus('error');
    }
  };

  useEffect(() => {
    testAPI();
  }, []);

  const getStatusColor = () => {
    switch(status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'testing': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error': return <XCircle className="h-5 w-5 text-red-600" />;
      case 'testing': return <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />;
      default: return <Globe className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            API Connection Debugger
          </CardTitle>
          <CardDescription>
            Test connection to your ASP.NET Core API
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
            <div>
              <div className="font-medium">API Status</div>
              <div className={`text-sm font-medium ${getStatusColor()}`}>
                {status === 'idle' && 'Ready to test'}
                {status === 'testing' && 'Testing connection...'}
                {status === 'success' && 'Connection successful'}
                {status === 'error' && 'Connection failed'}
              </div>
            </div>
            <Button
              onClick={testAPI}
              disabled={status === 'testing'}
              size="sm"
            >
              {status === 'testing' ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Test Again
                </>
              )}
            </Button>
          </div>

          {/* API Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">API URL</div>
                  <div className="text-sm text-muted-foreground font-mono">
                    {apiInfo.url}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Server Status</div>
                  <div className={`text-sm font-medium ${apiInfo.serverRunning ? 'text-green-600' : 'text-red-600'}`}>
                    {apiInfo.serverRunning ? 'Running' : 'Not reachable'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium mb-2">Connection Error:</div>
                <div className="text-sm mb-2">{error.message}</div>
                {error.status && (
                  <div className="text-sm">Status: {error.status}</div>
                )}
                {error.response && (
                  <div className="text-sm mt-2">
                    Response: {JSON.stringify(error.response)}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Data Preview */}
          {status === 'success' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Categories</div>
                      <div className="text-2xl font-bold">{data.categories.length}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.categories.slice(0, 3).map(cat => cat.name).join(', ')}
                        {data.categories.length > 3 && '...'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Products</div>
                      <div className="text-2xl font-bold">{data.products.length}</div>
                      <div className="text-sm text-muted-foreground">
                        {data.products.slice(0, 3).map(p => p.name).join(', ')}
                        {data.products.length > 3 && '...'}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Troubleshooting Tips */}
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-medium mb-2">If API is not working:</div>
                  <ul className="text-sm space-y-1 list-disc pl-4">
                    <li>Make sure ASP.NET API is running: <code>dotnet run</code></li>
                    <li>Check if API is accessible: <a href="https://localhost:7231/swagger" target="_blank" className="text-blue-600 hover:underline">https://localhost:7231/swagger</a></li>
                    <li>Verify CORS is configured in ASP.NET</li>
                    <li>Check browser console for detailed error logs</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </div>
          )}

          {/* Manual Test Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://localhost:7231/swagger', '_blank')}
            >
              Open Swagger
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://localhost:7231/api/Categories', '_blank')}
            >
              Test Categories Endpoint
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open('https://localhost:7231/api/Products', '_blank')}
            >
              Test Products Endpoint
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default APIDebugger;