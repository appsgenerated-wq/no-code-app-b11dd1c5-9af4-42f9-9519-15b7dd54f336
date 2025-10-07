import React, { useState } from 'react';
import config from '../constants.js';
import { FireIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

const LandingPage = ({ onLogin, onSignup }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            onLogin(email, password);
        } else {
            onSignup(name, email, password);
        }
    };

  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
          <FireIcon className="h-16 w-16 text-orange-500" />
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Discover & Share Amazing Recipes</h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Join a community of food lovers. Find new inspiration, create your own recipes, and share your culinary masterpieces with the world. All powered by a secure and scalable Manifest backend.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="rounded-md bg-gray-700 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700">Admin Panel</a>
            <button onClick={() => onLogin('user@manifest.build', 'password')} className="text-sm font-semibold leading-6 text-gray-900">Try Demo User <span aria-hidden="true">→</span></button>
          </div>
        </div>
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
            <div className="w-full max-w-md lg:flex-auto bg-white p-8 rounded-2xl shadow-2xl">
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        {isLogin ? 'Sign in to continue' : 'Join our community of chefs!'}
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Name</label>
                            <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                        </div>
                    )}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                        <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <input id="password" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm" />
                    </div>
                    <button type="submit" className="w-full flex justify-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500">
                        {isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                    <button onClick={() => setIsLogin(!isLogin)} className="font-semibold leading-6 text-orange-600 hover:text-orange-500">
                        {isLogin ? 'Sign up' : 'Sign in'}
                    </button>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
