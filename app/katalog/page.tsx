import { Metadata } from 'next';
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { DragonCard } from '@/components/molecules/DragonCard';
import { SectionHeading } from '@/components/atoms';

export const metadata: Metadata = {
  title: 'Dragon Catalog - Drakonimi',
  description: 'Browse our complete collection of dragons from around the world',
};

export default async function KatalogPage() {
  const dragons = await fetchQuery(api.dragons.getAvailable);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <SectionHeading level={1} icon="🐉">
            Dragon Catalog
          </SectionHeading>
          <p className="text-gray-600 mt-4">
            Explore our comprehensive collection of {dragons.length} dragons
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dragons.map((dragon: any) => (
            <DragonCard
              key={dragon._id}
              dragon={{
                _id: dragon._id,
                name: dragon.name,
                latinName: dragon.latinName,
                images: dragon.images,
                element: dragon.element,
                dangerLevel: dragon.dangerLevel as 'harmless' | 'cautious' | 'dangerous' | 'deadly' | 'legendary' | undefined,
                shortDescription: dragon.shortDescription,
              }}
            />
          ))}
        </div>

        {dragons.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl">No dragons found</p>
          </div>
        )}
      </div>
    </div>
  );
}
