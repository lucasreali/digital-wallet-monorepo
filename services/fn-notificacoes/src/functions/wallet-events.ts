import { app } from '@azure/functions';
import { saveEvent } from '../event-store';
import { parseEvent } from '../events';

// Message trigger: consumes the events published by svc-identidade and svc-carteira
app.storageQueue('walletEvents', {
  queueName: 'wallet-events',
  connection: 'AZURE_STORAGE_CONNECTION_STRING',
  handler: async (message, context) => {
    const event = parseEvent(message);
    await saveEvent(event);
    context.log(`Stored ${event.type} ${event.id}`);
  },
});
