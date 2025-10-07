import React, { useEffect, useState, useCallback } from 'react';
import config from '../constants.js';
import { PhotoIcon, PlusIcon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

// Feature-Aware: ImageUploader Component for 'type: image' fields
const ImageUploader = ({ onFileSelect, preview }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive ? 'border-orange-400 bg-orange-50' : 'border-gray-300'}`}>
        {preview ? (
            <div className='relative inline-block'>
                <img src={preview} alt="Preview" className='max-h-40 rounded-md' />
                <button onClick={() => onFileSelect(null)} className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1'><XMarkIcon className='h-4 w-4'/></button>
            </div>
        ) : (
            <label htmlFor='file-upload' className='cursor-pointer'>
                <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drag photo here or <span className='font-semibold text-orange-600'>click to upload</span></p>
                <input id='file-upload' type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e.target.files[0])} />
            </label>
        )}
    </div>
  );
};

// Feature-Aware: ChoiceSelector Component for 'type: choice' fields
const ChoiceSelector = ({ label, options, selectedValue, onSelect, helpText }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex flex-wrap gap-2 mt-2">
            {options.map((option) => (
                <button
                    type="button"
                    key={option}
                    onClick={() => onSelect(option)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${selectedValue === option ? 'bg-orange-500 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                    {option}
                </button>
            ))}
        </div>
        {helpText && <p className='mt-1 text-xs text-gray-500'>{helpText}</p>}
    </div>
);


const DashboardPage = ({ user, onLogout, manifest }) => {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    description: '',
    ingredients: '',
    prepTime: 30,
    cookTime: 45,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Other',
    status: 'draft',
    photo: null,
  });
  const [photoPreview, setPhotoPreview] = useState(null);

  const loadRecipes = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await manifest.from('Recipe').find({ 
        include: ['author'],
        filter: { status: 'published' },
        sort: { createdAt: 'desc' } 
      });
      setRecipes(response.data);
    } catch (error) {
      console.error("Failed to load recipes:", error);
    } finally {
      setIsLoading(false);
    }
  }, [manifest]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  const handleFileSelect = (selectedFile) => {
      setNewRecipe({...newRecipe, photo: selectedFile});
      if(selectedFile) {
          const reader = new FileReader();
          reader.onloadend = () => setPhotoPreview(reader.result);
          reader.readAsDataURL(selectedFile);
      } else {
          setPhotoPreview(null);
      }
  }

  const handleCreateRecipe = async (e) => {
    e.preventDefault();
    try {
      await manifest.from('Recipe').create(newRecipe);
      setShowForm(false);
      setNewRecipe({ title: '', description: '', ingredients: '', prepTime: 30, cookTime: 45, servings: 4, difficulty: 'Medium', cuisine: 'Other', status: 'draft', photo: null });
      setPhotoPreview(null);
      loadRecipes();
    } catch (error) {
      console.error("Failed to create recipe:", error);
      alert('Failed to create recipe. Please check the fields and try again.');
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
      if (window.confirm('Are you sure you want to delete this recipe?')) {
          try {
              await manifest.from('Recipe').delete(recipeId);
              loadRecipes();
          } catch (error) {
              console.error('Failed to delete recipe:', error);
              alert('You do not have permission to delete this recipe.');
          }
      }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <div className='flex items-center gap-2'>
                  <FireIcon className='h-8 w-8 text-orange-500'/>
                  <h1 className="text-2xl font-bold text-gray-900">Recipe Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                  <span className='text-gray-600'>Welcome, <span className='font-semibold'>{user.name}</span>!</span>
                  <a href={`${config.BACKEND_URL}/admin`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-gray-600 hover:text-orange-500">Admin Panel</a>
                  <button onClick={onLogout} className="rounded-md bg-orange-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">Logout</button>
              </div>
          </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Latest Recipes</h2>
          <button onClick={() => setShowForm(!showForm)} className="inline-flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700">
              <PlusIcon className="h-5 w-5" />
              {showForm ? 'Cancel' : 'New Recipe'}
          </button>
        </div>

        {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 animate-fade-in">
                <h3 className="text-lg font-semibold mb-4">Create a New Recipe</h3>
                <form onSubmit={handleCreateRecipe} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className='space-y-4'>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" value={newRecipe.title} onChange={(e) => setNewRecipe({...newRecipe, title: e.target.value})} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Description (Instructions)</label>
                             <textarea value={newRecipe.description} onChange={(e) => setNewRecipe({...newRecipe, description: e.target.value})} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-gray-700">Ingredients</label>
                             <textarea value={newRecipe.ingredients} onChange={(e) => setNewRecipe({...newRecipe, ingredients: e.target.value})} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea>
                        </div>
                    </div>
                    <div className='space-y-4'>
                        <ImageUploader onFileSelect={handleFileSelect} preview={photoPreview}/>
                        <div className='grid grid-cols-3 gap-4'>
                            <div><label className="block text-sm font-medium text-gray-700">Prep Time (min)</label><input type='number' value={newRecipe.prepTime} onChange={(e) => setNewRecipe({...newRecipe, prepTime: parseInt(e.target.value)})} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500' /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Cook Time (min)</label><input type='number' value={newRecipe.cookTime} onChange={(e) => setNewRecipe({...newRecipe, cookTime: parseInt(e.target.value)})} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500' /></div>
                            <div><label className="block text-sm font-medium text-gray-700">Servings</label><input type='number' value={newRecipe.servings} onChange={(e) => setNewRecipe({...newRecipe, servings: parseInt(e.target.value)})} className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500' /></div>
                        </div>
                        <ChoiceSelector label='Difficulty' options={['Easy', 'Medium', 'Hard']} selectedValue={newRecipe.difficulty} onSelect={(val) => setNewRecipe({...newRecipe, difficulty: val})} />
                        <ChoiceSelector label='Cuisine' options={['Italian', 'Mexican', 'Chinese', 'Indian', 'American', 'Other']} selectedValue={newRecipe.cuisine} onSelect={(val) => setNewRecipe({...newRecipe, cuisine: val})} />
                        <ChoiceSelector label='Status' options={['draft', 'published']} selectedValue={newRecipe.status} onSelect={(val) => setNewRecipe({...newRecipe, status: val})} helpText='Drafts are only visible to you.'/>
                        <button type="submit" className="w-full flex justify-center rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-600">Create Recipe</button>
                    </div>
                </form>
            </div>
        )}

        {isLoading ? <p>Loading recipes...</p> : (
          recipes.length === 0 ? <p className='text-center text-gray-500 py-10'>No recipes found. Create one to get started!</p> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map(recipe => (
                <div key={recipe.id} className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
                  {recipe.photo && <img src={recipe.photo.thumbnail} alt={recipe.title} className="w-full h-48 object-cover" />}
                  <div className="p-4">
                    <div className='flex justify-between items-start'>
                        <h3 className="text-lg font-semibold text-gray-800">{recipe.title}</h3>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{recipe.difficulty}</span>
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                        <UserCircleIcon className="h-5 w-5 mr-1 text-gray-400" />
                        <span>{recipe.author ? recipe.author.name : 'Unknown Author'}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-2" dangerouslySetInnerHTML={{__html: recipe.description}}></p>
                    {/* Feature-Aware: Ownership-based UI */}
                    {user && user.id === recipe.authorId && (
                        <div className='mt-4 pt-4 border-t border-gray-200 flex justify-end gap-2'>
                            <button disabled className='text-xs font-semibold text-gray-400 cursor-not-allowed'>Edit</button>
                            <button onClick={() => handleDeleteRecipe(recipe.id)} className='text-xs font-semibold text-red-500 hover:text-red-700'>Delete</button>
                        </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
