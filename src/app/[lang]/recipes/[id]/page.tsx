// app/recipes/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Recipe } from '../../../../../types';
import { getRecipeById } from '../../../../../lib/firebase-server';
import { event } from '../../../../../lib/gtag';

export default function RecipeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const recipeId = params.id as string;

    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions'>('ingredients');
    const [servings, setServings] = useState(4);

    useEffect(() => {
        if (recipe) {
            event({
                action: 'view_recipe',
                category: 'Recipes',
                label: recipe.title.en,
                value: 1
            });
        }
    }, [recipe]);
    useEffect(() => {
        const loadRecipe = async () => {
            try {
                setLoading(true);
                const recipeData = await getRecipeById(recipeId);
                setRecipe(recipeData);
                if (recipeData) {
                    setServings(recipeData.servings);
                }
            } catch (err) {
                console.error('Error loading recipe:', err);
            } finally {
                setLoading(false);
            }
        };

        if (recipeId) {
            loadRecipe();
        }
    }, [recipeId]);

    if (loading) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50">
                <div className="container mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-96 bg-gray-200 rounded-lg mb-8"></div>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-full"></div>
                                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            </div>
                            <div className="space-y-4">
                                <div className="h-32 bg-gray-200 rounded"></div>
                                <div className="h-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen pt-16 bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🍽️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Recipe Not Found</h2>
                    <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
                    <button
                        onClick={() => router.push('/recipes')}
                        className="bg-primary-gold text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                        Browse All Recipes
                    </button>
                </div>
            </div>
        );
    }

    // Calculate adjusted ingredients based on servings
    const adjustIngredientQuantity = (ingredient: string): string => {
        if (!recipe) return ingredient;

        const originalServings = recipe.servings;
        const ratio = servings / originalServings;

        // Simple regex to find numbers and adjust them
        return ingredient.replace(/(\d+\.?\d*)/g, (match) => {
            const number = parseFloat(match);
            const adjusted = number * ratio;
            return adjusted % 1 === 0 ? adjusted.toString() : adjusted.toFixed(1);
        });
    };

    return (
        <div className=" min-h-screen pt-16 bg-white">
            {/* Hero Section with Image */}
          <div className="min-h-screen bg-white">
  {/* Hero Section */}
  <div className="relative h-auto md:h-[500px] bg-gradient-to-br from-orange-400 to-yellow-500 flex flex-col md:flex-row items-center justify-between p-8 md:p-16">
    
    {/* Back Button */}
    <button
      onClick={() => router.push('/recipes')}
      className="absolute top-6 left-6 inline-flex items-center text-white hover:text-gray-200 transition-colors bg-black/40 rounded-lg px-4 py-2 hover:bg-black/60 border border-white/30"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Recipes
    </button>

    {/* Left Text Section */}
    <div className="flex-1 text-white z-10">
      <h1 className="font-amiri text-5xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
        {recipe.title.en}
      </h1>
      <p className="text-xl md:text-2xl max-w-lg drop-shadow-lg leading-relaxed">
        {recipe.description.en}
      </p>
    </div>

    {/* Right Image Section */}
    {recipe.image && (
      <div className="flex-1 flex justify-center md:justify-end mt-8 md:mt-0">
        <img
          src={recipe.image}
          alt={recipe.title.en}
          className="w-full md:w-[400px] lg:w-[500px] h-auto object-cover rounded-2xl shadow-xl border-4 border-white/30"
          onError={(e) => {
            console.error('Image failed to load');
            e.currentTarget.style.display = 'none';
          }}
        />
      </div>
    )}
  </div>
</div>

            {/* Recipe Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {/* Recipe Meta Info */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-primary-gold rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-white font-bold">⏱️</span>
                                    </div>
                                    <div className="font-semibold text-gray-800">Prep Time</div>
                                    <div className="text-gray-600">{recipe.preparationTime} min</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-moroccan-blue rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-white font-bold">🍳</span>
                                    </div>
                                    <div className="font-semibold text-gray-800">Cook Time</div>
                                    <div className="text-gray-600">{recipe.cookingTime} min</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-white font-bold">👥</span>
                                    </div>
                                    <div className="font-semibold text-gray-800">Servings</div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <button
                                            onClick={() => setServings(Math.max(1, servings - 1))}
                                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold">{servings}</span>
                                        <button
                                            onClick={() => setServings(servings + 1)}
                                            className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <span className="text-white font-bold">⚡</span>
                                    </div>
                                    <div className="font-semibold text-gray-800">Difficulty</div>
                                    <div className={`font-bold ${recipe.difficulty === 'Easy' ? 'text-green-600' :
                                        recipe.difficulty === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                        }`}>
                                        {recipe.difficulty}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dietary Tags */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {recipe.restrictions.vegetarian && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    🌱 Vegetarian
                                </span>
                            )}
                            {recipe.restrictions.vegan && (
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    🌿 Vegan
                                </span>
                            )}
                            {recipe.restrictions.glutenFree && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    🌾 Gluten-Free
                                </span>
                            )}
                            {recipe.restrictions.dairyFree && (
                                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    🥛 Dairy-Free
                                </span>
                            )}
                            {recipe.restrictions.spicy && (
                                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                                    🌶️ Spicy
                                </span>
                            )}
                        </div>

                        {/* Tab Navigation */}
                        <div className="border-b border-gray-200 mb-8">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setActiveTab('ingredients')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'ingredients'
                                        ? 'border-primary-gold text-primary-gold'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Ingredients
                                </button>
                                <button
                                    onClick={() => setActiveTab('instructions')}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'instructions'
                                        ? 'border-primary-gold text-primary-gold'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    Instructions
                                </button>
                            </nav>
                        </div>

                        {/* Tab Content */}
                        {activeTab === 'ingredients' && (
                            <div className="space-y-4">
                                <h3 className="font-amiri text-2xl font-bold text-gray-800 mb-6">Ingredients</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {recipe.ingredients.en.map((ingredient, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <div className="w-6 h-6 border-2 border-primary-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                                <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                                            </div>
                                            <span className="text-gray-700">
                                                {adjustIngredientQuantity(ingredient)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'instructions' && (
                            <div className="space-y-6">
                                <h3 className="font-amiri text-2xl font-bold text-gray-800 mb-6">Instructions</h3>
                                <div className="space-y-6">
                                    {recipe.instructions.en.map((instruction, index) => (
                                        <div key={index} className="flex items-start">
                                            <div className="w-8 h-8 bg-primary-gold text-white rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Nutrition Info */}
                        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                            <h3 className="font-amiri text-xl font-bold text-gray-800 mb-4">Nutrition Facts</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Calories</span>
                                    <span className="font-semibold">{recipe.nutrition.calories}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Protein</span>
                                    <span className="font-semibold">{recipe.nutrition.protein}g</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Carbs</span>
                                    <span className="font-semibold">{recipe.nutrition.carbs}g</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fat</span>
                                    <span className="font-semibold">{recipe.nutrition.fat}g</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Fiber</span>
                                    <span className="font-semibold">{recipe.nutrition.fiber}g</span>
                                </div>
                            </div>
                        </div>

                        {/* Recipe Tags */}
                        <div className="bg-gray-50 rounded-2xl p-6">
                            <h3 className="font-amiri text-xl font-bold text-gray-800 mb-4">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {recipe.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Origin Info */}
                        {recipe.origin && (
                            <div className="bg-gray-50 rounded-2xl p-6 mt-6">
                                <h3 className="font-amiri text-xl font-bold text-gray-800 mb-2">Origin</h3>
                                <p className="text-gray-600">{recipe.origin}, Morocco</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Related Recipes Section */}
            <div className="bg-gray-50 py-12 mt-12">
                <div className="container mx-auto px-4">
                    <h2 className="font-amiri text-3xl font-bold text-center mb-8">More Moroccan Recipes</h2>
                    <div className="text-center">
                        <button
                            onClick={() => router.push('/recipes')}
                            className="bg-yellow-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                        >
                            Explore All Recipes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}