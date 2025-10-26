import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { DragonDetailTemplate } from '@/components/templates/DragonDetailTemplate';
import { Doc } from '@/convex/_generated/dataModel';

interface DragonPageProps {
  params: Promise<{ latinName: string }>;
}

// Generate static params for all dragons
export async function generateStaticParams() {
  const dragons = await fetchQuery(api.dragons.list);
  return dragons.map((dragon: Doc<'dragons'>) => ({
    latinName: (dragon.latinName || dragon.name).toLowerCase().replace(/\s+/g, '-'),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: DragonPageProps): Promise<Metadata> {
  const { latinName: rawLatinName } = await params;
  const latinName = rawLatinName.toLowerCase().replace(/-/g, ' ');
  
  const dragon = await fetchQuery(api.dragons.getByLatinName, { latinName });
  
  if (!dragon) {
    return {
      title: 'Dragon Not Found',
    };
  }

  return {
    title: `${dragon.name} (${dragon.latinName || dragon.name}) - Drakonimi`,
    description: dragon.shortDescription || dragon.description || `Learn about ${dragon.name}`,
    openGraph: {
      images: dragon.images?.[0] ? [dragon.images[0]] : (dragon.imageUrl ? [dragon.imageUrl] : []),
    },
  };
}

export default async function DragonPage({ params }: DragonPageProps) {
  const { latinName: rawLatinName } = await params;
  const latinName = rawLatinName.toLowerCase().replace(/-/g, ' ');
  
  // Fetch dragon data
  const dragon = await fetchQuery(api.dragons.getByLatinName, { latinName });
  
  if (!dragon) {
    notFound();
  }

  // Fetch related dragons
  const relatedDragons = await fetchQuery(api.dragons.getRelated, {
    dragonId: dragon._id,
    limit: 3,
  });

  // Map category data if present
  const categories = dragon.categories?.map((cat: string) => ({
    name: cat,
    content: `Detailed information about ${cat} for ${dragon.name}.`,
  })) || [];

  // Map dragon data to template props with explicit type casting
  const dragonData = {
    _id: dragon._id,
    name: dragon.name,
    latinName: dragon.latinName || dragon.name,
    images: dragon.images || (dragon.imageUrl ? [dragon.imageUrl] : []),
    element: dragon.element,
    dangerLevel: dragon.dangerLevel as 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary' | undefined,
    shortDescription: dragon.shortDescription || dragon.description,
    description: dragon.description,
    habitat: dragon.habitat,
    powerLevel: dragon.powerLevel,
    wingspan: dragon.wingspan,
    intelligence: dragon.intelligence,
    speed: dragon.speed,
    fireBreath: dragon.fireBreath,
    family: dragon.family,
    order: dragon.order,
    origin: dragon.origin,
    diet: dragon.diet,
    lifespan: dragon.lifespan,
    abilities: dragon.abilities,
  };

  const relatedDragonsData = relatedDragons.map((d: Doc<'dragons'>) => ({
    _id: d._id,
    name: d.name,
    latinName: d.latinName || d.name,
    images: d.images || (d.imageUrl ? [d.imageUrl] : []),
    element: d.element,
    dangerLevel: d.dangerLevel as 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary' | undefined,
    shortDescription: d.shortDescription || d.description,
  }));

  return (
    <DragonDetailTemplate
      dragon={dragonData}
      categories={categories.length > 0 ? categories : undefined}
      relatedDragons={relatedDragonsData}
    />
  );
}
