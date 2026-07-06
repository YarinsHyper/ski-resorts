import { ApiProvider, Hotel, HotelSearchResult, SearchQuery } from "../types";
import { ProviderRegistry } from "../providers/ProviderRegistry";
import { generateFallbackHotels } from "../utils/mockHotels";

export class HotelSearchManager {
  private registry: ProviderRegistry;

  constructor(registry: ProviderRegistry) {
    this.registry = registry;
  }

  async search(query: SearchQuery): Promise<HotelSearchResult> {
    const allHotels = await this.fetchFromAllProviders(query);

    const uniqueHotels = this.deduplicateHotels(allHotels);
    const sortedHotels = this.sortByPrice(uniqueHotels);

    return {
      hotels: sortedHotels,
      totalCount: sortedHotels.length,
    };
  }

  private async fetchFromAllProviders(query: SearchQuery): Promise<Hotel[]> {
    // const allPromises: Promise<Hotel[]>[] = [];
    // const providers = this.registry.getAllProviders();

    // for (const provider of providers) {
    //   allPromises.push(provider.search(query));
    // }

    // const results = await Promise.allSettled(allPromises);

    // const hotels: Hotel[] = [];
    // for (const result of results) {
    //   if (result.status === "fulfilled") {
    //     hotels.push(...result.value);
    //   }
    // }
    const hotels: Hotel[] = generateFallbackHotels(query);

    return hotels;
  }

  private deduplicateHotels(hotels: Hotel[]): Hotel[] {
    const seen = new Set<string>();
    const unique: Hotel[] = [];

    for (const hotel of hotels) {
      const key = `${hotel.name}-${hotel.capacity}-${hotel.price}`;

      if (!seen.has(key)) {
        seen.add(key);
        unique.push(hotel);
      }
    }

    return unique;
  }

  private sortByPrice(hotels: Hotel[]): Hotel[] {
    return [...hotels].sort((a, b) => a.price - b.price);
  }

  // addProvider(provider: ApiProvider): void {
  //   this.registry.register(provider);
  // }

  // removeProvider(providerName: string): void {
  //   this.registry.unregister(providerName);
  // }

  // getProviders(): ApiProvider[] {
  //   return this.registry.getAllProviders();
  // }

  // getProviderRegistry(): ProviderRegistry {
  //   return this.registry;
  // }
}
