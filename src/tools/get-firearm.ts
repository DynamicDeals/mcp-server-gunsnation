import { z } from 'zod';
import { GunsnationApiClient } from '../api/client';
import { Firearm } from '../types';

export const getFirearmSchema = z.object({
  id: z.union([z.string(), z.number()]).describe('The ID of the firearm to retrieve'),
});

export type GetFirearmInput = z.infer<typeof getFirearmSchema>;

function formatDetailedFirearm(firearm: Firearm): string {
  const lines: string[] = [];

  lines.push(`# ${firearm.name}`);
  lines.push('');

  // Basic Info
  lines.push('## Basic Information');
  lines.push(`- **ID**: ${firearm.id}`);
  if (firearm.brand) lines.push(`- **Brand**: ${firearm.brand}`);
  if (firearm.caliber) lines.push(`- **Caliber**: ${firearm.caliber}`);
  if (firearm.action) lines.push(`- **Action**: ${firearm.action}`);
  if (firearm.category) lines.push(`- **Category**: ${firearm.category}`);
  if (firearm.upc) lines.push(`- **UPC**: ${firearm.upc}`);
  if (firearm.price !== null) lines.push(`- **Price**: $${firearm.price.toFixed(2)}`);
  lines.push('');

  // Specifications
  const specs = firearm.specifications;
  const hasSpecs = Object.values(specs).some(v => v !== null && v !== undefined);

  if (hasSpecs) {
    lines.push('## Specifications');
    if (specs.barrelLength) lines.push(`- **Barrel Length**: ${specs.barrelLength}"`);
    if (specs.overallLength) lines.push(`- **Overall Length**: ${specs.overallLength}"`);
    if (specs.weight) lines.push(`- **Weight**: ${specs.weight} oz`);
    if (specs.capacity) lines.push(`- **Capacity**: ${specs.capacity}`);
    if (specs.material) lines.push(`- **Material**: ${specs.material}`);
    if (specs.finish) lines.push(`- **Finish**: ${specs.finish}`);
    if (specs.sightType) lines.push(`- **Sight Type**: ${specs.sightType}`);
    if (specs.safetyFeatures) lines.push(`- **Safety Features**: ${specs.safetyFeatures}`);
    if (specs.frameSize) lines.push(`- **Frame Size**: ${specs.frameSize}`);
    if (specs.stockMaterial) lines.push(`- **Stock Material**: ${specs.stockMaterial}`);
    if (specs.stockType) lines.push(`- **Stock Type**: ${specs.stockType}`);
    if (specs.magazinesIncluded) lines.push(`- **Magazines Included**: ${specs.magazinesIncluded}`);
    lines.push('');
  }

  // Description
  if (firearm.description) {
    lines.push('## Description');
    lines.push(firearm.description);
    lines.push('');
  }

  // Images
  if (firearm.images.length > 0) {
    lines.push('## Images');
    firearm.images.forEach((img, index) => {
      lines.push(`- Image ${index + 1}: ${img.original}`);
    });
  }

  return lines.join('\n');
}

export async function getFirearm(
  client: GunsnationApiClient,
  input: GetFirearmInput
): Promise<string> {
  const response = await client.getFirearm({
    id: input.id,
  });

  if (!response.success) {
    return `Error: ${response.error.message} (${response.error.code})`;
  }

  return formatDetailedFirearm(response.data);
}
