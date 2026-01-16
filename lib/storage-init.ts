import { supabaseServer } from '@/lib/supabase';

export async function ensureStorageBuckets() {
  try {
    // Check if team-images bucket exists
    const { data: buckets } = await supabaseServer.storage.listBuckets();
    const teamImagesBucketExists = buckets?.some(b => b.name === 'team-images');

    if (!teamImagesBucketExists) {
      console.log('Creating team-images bucket...');
      
      const { data, error } = await supabaseServer.storage.createBucket('team-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });

      if (error) {
        console.error('Error creating bucket:', error);
        throw error;
      }

      console.log('✓ team-images bucket created successfully');
      return true;
    }

    console.log('✓ team-images bucket already exists');
    return true;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    throw error;
  }
}
