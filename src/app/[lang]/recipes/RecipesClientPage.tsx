'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Recipe } from '../../../../types';
import RecipeCard from './RecipeCard';
import { getRecipes } from '../../../../lib/firebase-server';

interface RecipesClientPageProps {
  initialRecipes: Recipe[];
  lang: string;
}

export default function RecipesClientPage({ initialRecipes, lang }: RecipesClientPageProps) {
    const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');

      const getLocalizedTitle = (recipe: Recipe) => {
    return recipe.title[lang as keyof typeof recipe.title] || recipe.title.en;
  };

  const getLocalizedDescription = (recipe: Recipe) => {
    return recipe.description[lang as keyof typeof recipe.description] || recipe.description.en;
  };

    // Keep this for client-side refreshes if needed
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
            getLocalizedTitle(recipe).toLowerCase().includes(searchTerm.toLowerCase()) ||
            getLocalizedDescription(recipe).toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                        <RecipeCard key={recipe.id} recipe={recipe} lang={lang} />
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