import { z } from 'zod';
import { GunsnationApiClient } from '../api/client';
import { Firearm } from '../types';

export const searchFirearmsSchema = z.object({
  query: z.string().optional().describe('Search query for firearm name, brand, model, or UPC'),
  category: z.string().optional().describe('Category filter (e.g., "Handguns", "Rifles", "Shotguns")'),
  limit: z.number().min(1).max(100).optional().default(20).describe('Maximum number of results (1-100, default: 20)'),
  offset: z.number().min(0).optional().default(0).describe('Number of results to skip for pagination'),
});

export type SearchFirearmsInput = z.infer<typeof searchFirearmsSchema>;

function formatFirearmForDisplay(firearm: Firearm): string {
  const lines: string[] = [];

  lines.push(`**${firearm.name}**`);
  lines.push(`- ID: ${firearm.id}`);

  if (firearm.brand) {
    lines.push(`- Brand: ${firearm.brand}`);
  }
  if (firearm.caliber) {
    lines.push(`- Caliber: ${firearm.caliber}`);
  }
  if (firearm.action) {
    lines.push(`- Action: ${firearm.action}`);
  }
  if (firearm.price !== null) {
    lines.push(`- Price: $${firearm.price.toFixed(2)}`);
  }
  if (firearm.specifications.barrelLength) {
    lines.push(`- Barrel Length: ${firearm.specifications.barrelLength}"`);
  }
  if (firearm.specifications.weight) {
    lines.push(`- Weight: ${firearm.specifications.weight} oz`);
  }
  if (firearm.images.length > 0) {
    lines.push(`- Image: ${firearm.images[0].original}`);
  }

  return lines.join('\n');
}

export async function searchFirearms(
  client: GunsnationApiClient,
  input: SearchFirearmsInput
): Promise<string> {
  const response = await client.searchFirearms({
    query: input.query,
    category: input.category,
    limit: input.limit,
    offset: input.offset,
  });

  if (!response.success) {
    return `Error: ${response.error.message} (${response.error.code})`;
  }

  if (response.data.length === 0) {
    return 'No firearms found matching your search criteria.';
  }

  const results: string[] = [];
  results.push(`Found ${response.meta.total} firearms (showing ${response.data.length}):\n`);

  for (const firearm of response.data) {
    results.push(formatFirearmForDisplay(firearm));
    results.push(''); // Empty line between results
  }

  if (response.meta.offset + response.data.length < response.meta.total) {
    results.push(`\n---\nShowing ${response.meta.offset + 1}-${response.meta.offset + response.data.length} of ${response.meta.total}. Use offset parameter to see more results.`);
  }

  return results.join('\n');
}
