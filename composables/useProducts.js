// Fonte única de produtos mock para homepage e marketplace
// Front-end only (sem tocar no back-end)

export function useProducts() {
  const products = ref([
    {
      id: 'fp-001',
      title: 'Lead Scoring automático (HubSpot + IA)',
      description: 'Priorize leads automaticamente e multiplique conversões.',
      price: 199.9,
      image: '/images/banner-modelo.png',
      category: 'Marketing',
      rating: 4.8,
      reviews: 128,
      sales: 870,
      curated: true,
      badges: ['best_seller'],
      seller: { name: 'Studio FluxoPronto', level: 'Top Vendedor', rating: 4.9, verified: true },
      sponsored: false,
      tools: ['HubSpot', 'OpenAI', 'Nodemailer'],
      complexity: 'Avançado',
      resources: ['documentacao', 'video', 'suporte'],
    },
    {
      id: 'fp-002',
      title: 'Sync de pedidos (Loja → ERP)',
      description: 'Sincronize pedidos e reduza erros operacionais.',
      price: 349.0,
      image: '/images/banner-modelo.png',
      category: 'Backoffice',
      rating: 4.6,
      reviews: 96,
      sales: 420,
      curated: true,
      badges: ['popular'],
      seller: { name: 'Automate Co.', level: 'Vendedor Verificado', rating: 4.7, verified: true },
      sponsored: true,
      tools: ['WooCommerce', 'Bling', 'Google Sheets'],
      complexity: 'Intermediário',
      resources: ['documentacao', 'suporte'],
    },
    {
      id: 'fp-003',
      title: 'Atendimento WhatsApp (n8n + Dialogflow)',
      description: 'Respostas inteligentes 24/7 integradas ao seu CRM.',
      price: 499.0,
      image: '/images/banner-modelo.png',
      category: 'Atendimento',
      rating: 4.7,
      reviews: 64,
      sales: 310,
      curated: false,
      badges: [],
      seller: { name: 'ChatMasters', level: 'Vendedor', rating: 4.6, verified: false },
      sponsored: false,
      tools: ['WhatsApp', 'Dialogflow', 'PipeDrive'],
      complexity: 'Avançado',
      resources: ['documentacao'],
    },
    {
      id: 'fp-004',
      title: 'Score antifraude (checkout)',
      description: 'Avaliação de risco em tempo real para pagamentos online.',
      price: 429.0,
      image: '/images/banner-modelo.png',
      category: 'Vendas',
      rating: 4.5,
      reviews: 41,
      sales: 190,
      curated: true,
      badges: [],
      seller: { name: 'SecureOps', level: 'Vendedor Verificado', rating: 4.8, verified: true },
      sponsored: true,
      tools: ['Stripe', 'ClearSale', 'Slack'],
      complexity: 'Intermediário',
      resources: ['documentacao', 'suporte'],
    },
    {
      id: 'fp-005',
      title: 'Backoffice financeiro (conciliação)',
      description: 'Automatize conciliação e relatórios financeiros.',
      price: 279.0,
      image: '/images/banner-modelo.png',
      category: 'Financeiro',
      rating: 4.2,
      reviews: 22,
      sales: 120,
      curated: false,
      badges: [],
      seller: { name: 'DataFlow', level: 'Vendedor', rating: 4.3, verified: false },
      sponsored: false,
      tools: ['Conta Azul', 'Google Sheets'],
      complexity: 'Básico',
      resources: ['documentacao', 'video'],
    },
    {
      id: 'fp-006',
      title: 'Webhook to Sheet (universal)',
      description: 'Centralize eventos em planilhas com mapeamento dinâmico.',
      price: 149.0,
      image: '/images/banner-modelo.png',
      category: 'Backoffice',
      rating: 4.9,
      reviews: 12,
      sales: 85,
      curated: true,
      badges: ['popular'],
      seller: { name: 'Studio FluxoPronto', level: 'Top Vendedor', rating: 4.9, verified: true },
      sponsored: false,
      tools: ['Webhooks', 'Google Sheets'],
      complexity: 'Básico',
      resources: ['documentacao'],
    },
  ])

  const featured = computed(() => {
    return products.value
      .slice()
      .sort((a, b) => b.rating - a.rating || b.sales - a.sales)
      .slice(0, 8)
  })

  const topRated = computed(() => products.value.slice().sort((a, b) => b.rating - a.rating))
  const bestSellers = computed(() => products.value.slice().sort((a, b) => b.sales - a.sales))
  const sponsored = computed(() => products.value.filter(p => p.sponsored))
  const curated = computed(() => products.value.filter(p => p.curated))

  return { products, featured, topRated, bestSellers, sponsored, curated }
}


