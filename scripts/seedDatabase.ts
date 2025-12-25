
import { supabase } from '../lib/supabase';
import { curatedSneakers } from '../data/sneakerDatabase';

export async function seedDatabase() {
  console.log('Starting database seed...');
  console.log(`Seeding ${curatedSneakers.length} sneakers...`);

  try {
    // Convert the curated sneakers to the database format
    const sneakersToInsert = curatedSneakers.map((sneaker) => ({
      id: sneaker.id,
      sku: sneaker.sku,
      brand: sneaker.brand,
      model: sneaker.model,
      colorway: sneaker.colorway,
      silhouette: sneaker.silhouette || null,
      release_date: sneaker.releaseDate || null,
      retail_price: sneaker.retailPrice || null,
      estimated_value: sneaker.estimatedValue || null,
      image_url: sneaker.imageUrl || null,
      category: sneaker.category || 'Lifestyle',
      description: sneaker.description || null,
      tags: sneaker.tags || [],
      is_curated: true,
      verification_status: 'verified',
      popularity: sneaker.popularity || 0,
      added_by: null, // System-added
    }));

    // Insert in batches of 100 to avoid timeout
    const batchSize = 100;
    for (let i = 0; i < sneakersToInsert.length; i += batchSize) {
      const batch = sneakersToInsert.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from('sneakers')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(sneakersToInsert.length / batchSize)}`);
    }

    console.log('Database seeded successfully!');
    console.log(`Total sneakers: ${sneakersToInsert.length}`);

    // Get stats
    const { count } = await supabase
      .from('sneakers')
      .select('*', { count: 'exact', head: true });

    console.log(`Database now contains ${count} sneakers`);

    return { success: true, count };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error };
  }
}

// Run the seed if this file is executed directly
if (require.main === module) {
  seedDatabase().then((result) => {
    console.log('Seed result:', result);
    process.exit(result.success ? 0 : 1);
  });
}
