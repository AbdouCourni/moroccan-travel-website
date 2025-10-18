import { Metadata } from 'next';
import { getRecipes } from '../../../../lib/firebase-server';
import { convertRecipeData } from '../../../../lib/firebase-utils';
import RecipesClientPage from './RecipesClientPage';
import { Recipe } from '../../../../types';

// Generate metadata for recipes listing page
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  
  const titles = {
    en: "Authentic Moroccan Recipes | Traditional Cuisine & Cooking Guide",
    fr: "Recettes Marocaines Authentiques | Guide de Cuisine Traditionnelle",
    ar: "وصفات مغربية أصيلة | دليل الطهي التقليدي",
    es: "Recetas Marroquíes Auténticas | Guía de Cocina Tradicional"
  };

  const descriptions = {
    en: "Discover authentic Moroccan recipes with step-by-step instructions. Traditional tagines, couscous, pastries and more. Easy to follow recipes with cultural insights.",
    fr: "Découvrez des recettes marocaines authentiques avec des instructions détaillées. Tajines traditionnels, couscous, pâtisseries et plus encore.",
    ar: "اكتشف وصفات مغربية أصيلة مع تعليمات مفصلة. طاجين تقليدي، كسكس، معجنات والمزيد. وصفات سهلة المتابعة مع رؤى ثقافية.",
    es: "Descubre recetas marroquíes auténticas con instrucciones paso a paso. Tajines tradicionales, cuscús, pasteles y más."
  };

  return {
    title: titles[lang as keyof typeof titles] || titles.en,
    description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
    keywords: "moroccan recipes, tagine, couscous, traditional cooking, moroccan cuisine, moroccan food",
    openGraph: {
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      locale: lang,
      url: `https://morocompase.com/${lang}/recipes`,
      siteName: 'MoroCompase',
      images: [
        {
          url: '/images/recipes-og.jpg',
          width: 1200,
          height: 630,
          alt: 'Moroccan Recipes Collection'
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[lang as keyof typeof titles] || titles.en,
      description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
      images: ['/images/recipes-og.jpg']
    },
    alternates: {
      canonical: `https://morocompase.com/${lang}/recipes`,
      languages: {
        'en': 'https://morocompase.com/en/recipes',
        'fr': 'https://morocompase.com/fr/recipes',
        'ar': 'https://morocompase.com/ar/recipes',
        'es': 'https://morocompase.com/es/recipes'
      }
    },
    robots: {
      index: true,
      follow: true
    }
  };
}

// JSON-LD structured data component with language support
function RecipesStructuredData({ recipes, lang }: { recipes: Recipe[], lang: string }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Moroccan Recipes Collection",
    "description": "Authentic traditional Moroccan recipes and cooking instructions",
    "inLanguage": lang,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": recipes.length,
      "itemListElement": recipes.slice(0, 10).map((recipe, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Recipe",
          "name": recipe.title[lang as keyof typeof recipe.title] || recipe.title.en,
          "description": recipe.description[lang as keyof typeof recipe.description] || recipe.description.en,
          "image": recipe.image,
          "recipeCategory": recipe.category,
          "recipeCuisine": "Moroccan",
          "prepTime": `PT${recipe.preparationTime}M`,
          "cookTime": `PT${recipe.cookingTime}M`,
          "totalTime": `PT${recipe.totalTime || recipe.preparationTime + recipe.cookingTime}M`,
          "recipeYield": `${recipe.servings} servings`,
          "keywords": recipe.tags.join(', '),
          "nutrition": {
            "@type": "NutritionInformation",
            "calories": `${recipe.nutrition.calories} calories`,
            "proteinContent": `${recipe.nutrition.protein}g`,
            "carbohydrateContent": `${recipe.nutrition.carbs}g`,
            "fatContent": `${recipe.nutrition.fat}g`,
            "fiberContent": `${recipe.nutrition.fiber}g`,
            "sugarContent": `${recipe.nutrition.sugar}g`,
            "sodiumContent": `${recipe.nutrition.sodium}mg`
          },
          "suitableForDiet": [
            ...(recipe.restrictions.vegetarian ? ["https://schema.org/VegetarianDiet"] : []),
            ...(recipe.restrictions.vegan ? ["https://schema.org/VeganDiet"] : []),
            ...(recipe.restrictions.glutenFree ? ["https://schema.org/GlutenFreeDiet"] : []),
            ...(recipe.restrictions.dairyFree ? ["https://schema.org/DairyFreeDiet"] : [])
          ]
        }
      }))
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Server component that fetches data and passes to client component
export default async function RecipesPage({ params }: { params: { lang: string } }) {
  const { lang } = params;
  const recipes = await getRecipes();
  const convertedRecipes = recipes.map(recipe => convertRecipeData(recipe));  
  
  return (
    <>
      <RecipesStructuredData recipes={convertedRecipes} lang={lang} />
      <RecipesClientPage initialRecipes={convertedRecipes} lang={lang} />
    </>
  );
}