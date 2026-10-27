import { app } from '@azure/functions';
import { listEvents } from '../event-store';
import { computeScore } from '../score';

// Enrichment called by the BFF: financial score computed from the consumed events
app.http('insights', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request) => ({
    jsonBody: {
      score: computeScore(await listEvents(), request.query.get('ownerId') ?? undefined),
      generatedAt: new Date().toISOString(),
    },
  }),
});
