// app/recipes/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Recipe } from '../../../types';

// Firestore service
import { getRecipes, getRecipesByCategory } from '../../../lib/firebase-server';

export default function RecipesPage() {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            setLoading(true);
            const recipesData = await getRecipes();
            setRecipes(recipesData);
        } catch (err) {
            setError('Failed to load recipes');
            console.error('Error loading recipes:', err);
        } finally {
            setLoading(false);
        }
    };

    // Get unique categories for filter
    const categories = ['All', ...new Set(recipes.map(recipe => recipe.category))];
    const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

    // Filter recipes based on selections
    const filteredRecipes = recipes.filter(recipe => {
        const matchesCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'All' || recipe.difficulty === selectedDifficulty;
        const matchesSearch = searchTerm === '' ||
            recipe.title.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesCategory && matchesDifficulty && matchesSearch;
    });

    if (loading) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-moroccan-blue mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading delicious recipes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen pt-16 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-500 text-lg">{error}</p>
                    <button
                        onClick={loadRecipes}
                        className="mt-4 bg-moroccan-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="font-amiri text-4xl font-bold text-gray-900 mb-4">
                        Moroccan Recipes
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto text-lg mb-6">
                        Discover authentic Moroccan cuisine with traditional recipes passed down through generations
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-md mx-auto mb-6">
                        <input
                            type="text"
                            placeholder="Search recipes, ingredients, or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-transparent"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-gold"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>

                        <select
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-gold"
                        >
                            {difficulties.map(difficulty => (
                                <option key={difficulty} value={difficulty}>{difficulty}</option>
                            ))}
                        </select>

                        <button
                            onClick={() => {
                                setSelectedCategory('All');
                                setSelectedDifficulty('All');
                                setSearchTerm('');
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Pinterest Style Masonry Grid */}
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6 mb-12">
                    {filteredRecipes.map((recipe) => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredRecipes.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-6xl mb-4">🍽️</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
                        <p className="text-gray-500">Try adjusting your search or filters</p>
                    </div>
                )}

                {/* Back to Culture */}
                <div className="text-center">
                    <Link
                        href="/culture"
                        className="inline-flex items-center text-moroccan-blue hover:text-blue-700 transition-colors"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Culture
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Recipe Card Component
function RecipeCard({ recipe }: { recipe: Recipe }) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Calculate approximate content height for better masonry flow
    const getContentHeight = () => {
        let height = 200; // Base height for image
        
        // Add height based on content length
        if (recipe.title.en.length > 30) height += 20;
        if (recipe.description.en.length > 100) height += 40;
        if (recipe.restrictions.vegetarian || recipe.restrictions.vegan || recipe.restrictions.glutenFree) height += 30;
        
        return height;
    };

    return (
        <div
            className="break-inside-avoid mb-6 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ minHeight: `${getContentHeight()}px` }}
        >
            {/* Image Section */}
            <div className="relative overflow-hidden">
                {imageError ? (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-gold/20 to-moroccan-blue/20 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-4xl mb-2">🍽️</div>
                            <p className="text-gray-500 text-sm">Recipe Image</p>
                        </div>
                    </div>
                ) : (
                    <img
                        src={recipe.image}
                        alt={recipe.title.en}
                        className={`w-full h-48 object-cover transition-transform duration-500 ${
                            isHovered ? 'scale-105' : 'scale-100'
                        }`}
                        onError={() => setImageError(true)}
                        loading="lazy"
                    />
                )}
                
                {/* Difficulty Badge */}
                <div className="absolute top-3 left-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                        recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800 border border-green-200' :
                        recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                        {recipe.difficulty}
                    </span>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                    <span className="bg-moroccan-blue/90 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
                        {recipe.category}
                    </span>
                </div>
                
                {/* Hover Overlay */}
                <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                }`} />
            </div>

            {/* Content Section */}
            <div className="p-4">
                {/* Title */}
                <h3 className="font-amiri text-lg font-bold text-gray-800 mb-2 leading-tight">
                    {recipe.title.en}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3">
                    {recipe.description.en}
                </p>

                {/* Recipe Info */}
                <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                        <span className="mr-1">⏱️</span>
                        {recipe.totalTime || recipe.preparationTime + recipe.cookingTime}min
                    </div>
                    <div className="flex items-center">
                        <span className="mr-1">👥</span>
                        {recipe.servings}
                    </div>
                    <div className="flex items-center">
                        <span className="mr-1">🔥</span>
                        {recipe.nutrition.calories} cal
                    </div>
                </div>

                {/* Dietary Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {recipe.restrictions.vegetarian && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs border border-green-200">Vegetarian</span>
                    )}
                    {recipe.restrictions.vegan && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs border border-green-200">Vegan</span>
                    )}
                    {recipe.restrictions.glutenFree && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs border border-blue-200">Gluten-Free</span>
                    )}
                    {recipe.tags.slice(0, 2).map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* View Recipe Button */}
                <Link
                    href={`/recipes/${recipe.id}`}
                    className={`block w-full text-center py-2 rounded-lg transition-all duration-300 font-semibold text-sm border-2 ${
                        isHovered 
                            ? 'bg-yellow-500 text-white border-primary-gold' 
                            : 'bg-white text-primary-gold border-primary-gold hover:bg-primary-gold hover:text-white'
                    }`}
                >
                    View Recipe
                </Link>
            </div>
        </div>
    );
}