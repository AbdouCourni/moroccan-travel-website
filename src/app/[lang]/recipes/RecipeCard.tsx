'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Recipe } from '../../../../types';

interface RecipeCardProps {
  recipe: Recipe;
  lang: string;
}

export default function RecipeCard({ recipe, lang }: RecipeCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Get localized content with fallback to English
    const getLocalizedTitle = () => {
        return recipe.title[lang as keyof typeof recipe.title] || recipe.title.en;
    };

    const getLocalizedDescription = () => {
        return recipe.description[lang as keyof typeof recipe.description] || recipe.description.en;
    };

    const getLocalizedAltText = () => {
        return recipe.title[lang as keyof typeof recipe.title] || recipe.title.en;
    };

    // Calculate approximate content height for better masonry flow
    const getContentHeight = () => {
        const title = getLocalizedTitle();
        const description = getLocalizedDescription();
        
        let height = 200; // Base height for image
        
        // Add height based on content length
        if (title.length > 30) height += 20;
        if (description.length > 100) height += 40;
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
                        alt={getLocalizedAltText()}
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
                    {getLocalizedTitle()}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-3 leading-relaxed line-clamp-3">
                    {getLocalizedDescription()}
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
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs border border-green-200">
                            {lang === 'ar' ? 'نباتي' : 
                             lang === 'fr' ? 'Végétarien' :
                             lang === 'es' ? 'Vegetariano' : 'Vegetarian'}
                        </span>
                    )}
                    {recipe.restrictions.vegan && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs border border-green-200">
                            {lang === 'ar' ? 'نباتي صرف' : 
                             lang === 'fr' ? 'Végan' :
                             lang === 'es' ? 'Vegano' : 'Vegan'}
                        </span>
                    )}
                    {recipe.restrictions.glutenFree && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs border border-blue-200">
                            {lang === 'ar' ? 'خالي من الغلوتين' : 
                             lang === 'fr' ? 'Sans gluten' :
                             lang === 'es' ? 'Sin gluten' : 'Gluten-Free'}
                        </span>
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
                    {lang === 'ar' ? 'عرض الوصفة' : 
                     lang === 'fr' ? 'Voir la Recette' :
                     lang === 'es' ? 'Ver Receta' : 'View Recipe'}
                </Link>
            </div>
        </div>
    );
}