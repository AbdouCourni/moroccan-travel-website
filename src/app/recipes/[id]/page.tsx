// app/recipes/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Recipe } from '../../../../types';
import { getRecipeById } from '../../../../lib/firebase-server';

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRecipe();
  }, [recipeId]);

  const loadRecipe = async () => {
    try {
      setLoading(true);
      const recipeData = await getRecipeById(recipeId);
      setRecipe(recipeData);
    } catch (err) {
      setError('Failed to load recipe');
      console.error('Error loading recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  // Loading and error states...
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-8">
        {/* Recipe detail implementation */}
        <h1>{recipe.title.en}</h1>
        {/* Add full recipe details here */}
      </div>
    </div>
  );
}