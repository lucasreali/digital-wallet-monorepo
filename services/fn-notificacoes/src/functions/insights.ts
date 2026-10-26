import { app } from '@azure/functions';

// Enriquecimento chamado pelo BFF; trocar o valor fixo pela regra real (score, categorização do extrato...)
app.http('insights', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async () => ({ jsonBody: { score: 720, generatedAt: new Date().toISOString() } }),
});
