import { app } from '@azure/functions';
import { listEvents } from '../event-store';

// Activity feed: most recent consumed events, newest first
app.http('activity', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request) => {
    const limit = Number(request.query.get('limit') ?? 20);
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return { status: 400, jsonBody: { message: 'limit must be an integer between 1 and 100' } };
    }
    return { jsonBody: await listEvents(limit) };
  },
});
