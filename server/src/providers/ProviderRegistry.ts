import { ApiProvider } from '../types';

export class ProviderRegistry {
  private providers: Map<string, ApiProvider> = new Map();

  register(provider: ApiProvider): void {
    this.providers.set(provider.name, provider);
  }

  unregister(providerName: string): void {
    this.providers.delete(providerName);
  }

  getProvider(providerName: string): ApiProvider | undefined {
    return this.providers.get(providerName);
  }

  getAllProviders(): ApiProvider[] {
    return Array.from(this.providers.values());
  }

  hasProvider(providerName: string): boolean {
    return this.providers.has(providerName);
  }

  getProviderNames(): string[] {
    return Array.from(this.providers.keys());
  }

  clear(): void {
    this.providers.clear();
  }
}

export const providerRegistry = new ProviderRegistry();
