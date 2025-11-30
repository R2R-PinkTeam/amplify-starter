/**
 * Amplify Configuration Example
 * 
 * This file shows how to configure Amplify in your React app.
 * Copy this code to your src/main.tsx or src/App.tsx
 */

import { Amplify } from 'aws-amplify';
import outputs from '../amplify_outputs.json';

// Configure Amplify with backend outputs
Amplify.configure(outputs);

/**
 * Example: Using the Data Client
 */
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../amplify/data/resource';

// Create a typed client
const client = generateClient<Schema>();

// Example operations:

// 1. List all gum packs
export async function listGumPacks() {
  const { data, errors } = await client.models.GumPack.list();
  if (errors) {
    console.error('Error listing gum packs:', errors);
    return [];
  }
  return data;
}

// 2. Get a specific gum pack
export async function getGumPack(packId: string) {
  const { data, errors } = await client.models.GumPack.get({ packId });
  if (errors) {
    console.error('Error getting gum pack:', errors);
    return null;
  }
  return data;
}

// 3. Create a new rating
export async function createRating(
  packId: string,
  rating: number,
  comment: string,
  userName: string
) {
  const { data, errors } = await client.models.Rating.create({
    packId,
    ratingId: crypto.randomUUID(),
    rating,
    comment,
    userName,
    createdAt: new Date().toISOString(),
  });
  if (errors) {
    console.error('Error creating rating:', errors);
    return null;
  }
  return data;
}

// 4. Create an order
export async function createOrder(
  items: Array<{ packId: string; quantity: number }>,
  totalAmount: number,
  shippingAddress: Record<string, string>
) {
  const { data, errors } = await client.models.Order.create({
    orderId: crypto.randomUUID(),
    items,
    totalAmount,
    status: 'PENDING',
    shippingAddress,
    createdAt: new Date().toISOString(),
  });
  if (errors) {
    console.error('Error creating order:', errors);
    return null;
  }
  return data;
}

// 5. Create a celebrity request
export async function createCelebrityRequest(
  celebrity: 'Emma Watson' | 'Brad Pitt',
  packId: string,
  destination: string,
  requestedBy?: string,
  notes?: string
) {
  const { data, errors } = await client.models.CelebrityRequest.create({
    requestId: crypto.randomUUID(),
    celebrity,
    packId,
    destination,
    status: 'PENDING',
    requestedBy,
    notes,
    createdAt: new Date().toISOString(),
  });
  if (errors) {
    console.error('Error creating celebrity request:', errors);
    return null;
  }
  return data;
}

// 6. Subscribe to new ratings (real-time)
export function subscribeToNewRatings(
  callback: (rating: Schema['Rating']['type']) => void
) {
  const subscription = client.models.Rating.onCreate().subscribe({
    next: (data) => callback(data),
    error: (error) => console.error('Subscription error:', error),
  });
  
  // Return unsubscribe function
  return () => subscription.unsubscribe();
}

// 7. Update gum pack stock
export async function updateGumPackStock(packId: string, stock: number) {
  const { data, errors } = await client.models.GumPack.update({
    packId,
    stock,
  });
  if (errors) {
    console.error('Error updating stock:', errors);
    return null;
  }
  return data;
}

// 8. Query gum packs by color (requires GSI - future enhancement)
export async function getGumPacksByColor(color: string) {
  const { data, errors } = await client.models.GumPack.list({
    filter: { color: { eq: color } },
  });
  if (errors) {
    console.error('Error filtering by color:', errors);
    return [];
  }
  return data;
}

/**
 * Example React Hook
 */
import { useState, useEffect } from 'react';

export function useGumPacks() {
  const [gumPacks, setGumPacks] = useState<Schema['GumPack']['type'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchGumPacks() {
      try {
        setLoading(true);
        const packs = await listGumPacks();
        setGumPacks(packs);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchGumPacks();
  }, []);

  return { gumPacks, loading, error };
}

/**
 * Example React Component
 */
export function GumPackList() {
  const { gumPacks, loading, error } = useGumPacks();

  if (loading) return <div>Loading gum packs...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2>Gum Packs</h2>
      <ul>
        {gumPacks.map((pack) => (
          <li key={pack.packId}>
            <h3>{pack.name}</h3>
            <p>Color: {pack.color}</p>
            <p>Flavor: {pack.flavor}</p>
            <p>Price: ${pack.price}</p>
            <p>Stock: {pack.stock}</p>
            <p>Rating: {pack.averageRating?.toFixed(1) || 'No ratings'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
