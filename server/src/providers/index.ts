import { ExternalApiProvider } from './ExternalApiProvider';
import { ProviderRegistry } from './ProviderRegistry';

export function initializeProviders(registry: ProviderRegistry): void {
  registry.register(new ExternalApiProvider());
}
