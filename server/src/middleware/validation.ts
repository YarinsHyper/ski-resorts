import { Request, Response, NextFunction } from 'express';

export function validateSearchQuery(req: Request, res: Response, next: NextFunction): void {
  const { query } = req.body;

  if (!query) {
    res.status(400).json({
      error: 'Missing query object in request body',
    });
    return;
  }

  if (!query.ski_site || typeof query.ski_site !== 'number' || query.ski_site < 1) {
    res.status(400).json({
      error: 'Invalid ski_site: must be a positive number',
    });
    return;
  }

  const dateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!query.from_date || !dateRegex.test(query.from_date)) {
    res.status(400).json({
      error: 'Invalid from_date: must be in DD/MM/YYYY format',
    });
    return;
  }

  if (!query.to_date || !dateRegex.test(query.to_date)) {
    res.status(400).json({
      error: 'Invalid to_date: must be in DD/MM/YYYY format',
    });
    return;
  }

  if (!query.group_size || typeof query.group_size !== 'number') {
    res.status(400).json({
      error: 'Invalid group_size: must be a number',
    });
    return;
  }

  if (query.group_size < 1 || query.group_size > 10) {
    res.status(400).json({
      error: 'Invalid group_size: must be between 1 and 10',
    });
    return;
  }

  const fromDate = parseDate(query.from_date);
  const toDate = parseDate(query.to_date);

  if (fromDate >= toDate) {
    res.status(400).json({
      error: 'Invalid date range: from_date must be before to_date',
    });
    return;
  }

  next();
}

function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('/');
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}
