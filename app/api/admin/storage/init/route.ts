import { supabaseServer } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Check if team-images bucket exists
    const { data: buckets } = await supabaseServer.storage.listBuckets();
    const teamImagesBucketExists = buckets?.some(b => b.name === 'team-images');

    if (!teamImagesBucketExists) {
      console.log('📦 Creating team-images bucket...');
      
      const { data, error } = await supabaseServer.storage.createBucket('team-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });

      if (error) {
        console.error('❌ Error creating bucket:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log('✅ team-images bucket created successfully');
      return NextResponse.json({ message: 'Bucket created', bucketName: data?.name });
    }

    console.log('✅ team-images bucket already exists');
    return NextResponse.json({ message: 'Bucket already exists' });
  } catch (error) {
    console.error('❌ Error ensuring storage buckets:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
