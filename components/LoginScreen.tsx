import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { User, Lock, Eye, EyeOff, ShoppingCart } from 'lucide-react';
import { Screen, User as UserType } from '../App';

interface LoginScreenProps {
  setCurrentScreen: (screen: Screen) => void;
  handleLogin: (user: UserType) => void;
}

export function LoginScreen({ setCurrentScreen, handleLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      // For demo purposes, accept any non-empty credentials
      if (username && password) {
        const userData: UserType = {
          id: Date.now().toString(),
          username: username,
          email: `${username}@example.com`
        };
        handleLogin(userData);
      } else {
        setError('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
    }, 1500);
  };

  // Demo login function
  const handleDemoLogin = () => {
    const demoUser: UserType = {
      id: 'demo-user-123',
      username: 'demo',
      email: 'demo@payease.com'
    };
    setIsLoading(true);
    setTimeout(() => {
      handleLogin(demoUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="h-full bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 text-center pt-8 pb-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
          <ShoppingCart className="text-green-600" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">PayEase</h1>
        <p className="text-gray-600">Self-Checkout System</p>
      </div>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 pb-8">
        <Card className="w-full max-w-md bg-white shadow-xl">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome Back</h2>
              <p className="text-gray-600">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white active:scale-95 transition-all duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </Button>

              {/* Demo Login */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">or</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={handleDemoLogin}
                disabled={isLoading}
                className="w-full h-12 border-green-200 text-green-600 hover:bg-green-50 active:scale-95 transition-all duration-200"
              >
                Try Demo Login
              </Button>
            </form>

            {/* Help Text */}
            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-500">
                Demo credentials: any username and password
              </p>
              
              <div className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => setCurrentScreen('register')}
                  className="text-green-600 hover:text-green-700 font-medium"
                >
                  Create Account
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 text-center pb-6">
        <p className="text-sm text-gray-500">
          PayEase Self-Checkout v1.0
        </p>
      </div>
    </div>
  );
}