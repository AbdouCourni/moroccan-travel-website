// app/recipes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe } from '../../../types';
import Image from 'next/image';

// Firestore service (you'll need to set this up based on your Firebase config)
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

                {/* Recipes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
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

    return (
        <div
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative overflow-hidden">
                <Image
                    src={recipe.image}
                    alt={recipe.title.en}
                    width={400}
                    height={192}
                    className={`w-full h-48 object-cover transition-transform duration-300 ${isHovered ? 'scale-110' : 'scale-100'
                        }`}
                />
                <div className="absolute top-3 left-3">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                            recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {recipe.difficulty}
                    </span>
                </div>
                <div className="absolute top-3 right-3">
                    <span className="bg-moroccan-blue text-white px-2 py-1 rounded-full text-xs font-semibold">
                        {recipe.category}
                    </span>
                </div>
            </div>

            <div className="p-4">
                <h3 className="font-amiri text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                    {recipe.title.en}
                </h3>

                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
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
                <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.restrictions.vegetarian && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Vegetarian</span>
                    )}
                    {recipe.restrictions.vegan && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">Vegan</span>
                    )}
                    {recipe.restrictions.glutenFree && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">Gluten-Free</span>
                    )}
                </div>

                {/* View Recipe Button */}
                <Link
                    href={`/recipes/${recipe.id}`}
                    className="block w-full bg-primary-gold text-white text-center py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300 font-semibold text-sm"
                >
                    View Recipe
                </Link>
            </div>
        </div>
    );
}