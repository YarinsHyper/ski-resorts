import { Request, Response } from "express";
import { HotelSearchManager } from "../managers/HotelSearchManager";
import { SearchQuery, HotelSearchResult } from "../types";

export class HotelSearchController {
  constructor(private searchManager: HotelSearchManager) {}

  async search(req: Request, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      console.log(
        `Searching for ${query.group_size} people at ski_site ${query.ski_site}`
      );

      if (!this.isValidSearchQuery(query)) {
        console.log(`Invalid search query`);
        res.status(400).json({
          error: "Invalid search query",
          details:
            "Missing required fields: ski_site, from_date, to_date, group_size",
        });
        return;
      }

      const result: HotelSearchResult = await this.searchManager.search(query);

      console.log(`Found ${result.totalCount} hotels`);
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      console.error(`Search error:`, error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  private isValidSearchQuery(query: any): query is SearchQuery {
    return (
      query &&
      typeof query.ski_site === "number" &&
      typeof query.from_date === "string" &&
      typeof query.to_date === "string" &&
      typeof query.group_size === "number" &&
      query.group_size >= 1 &&
      query.group_size <= 10
    );
  }
}
