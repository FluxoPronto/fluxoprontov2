<template>
  <footer class="site-footer">
      <div class="container footer-grid">
        <div class="footer-brand">
          <NuxtLink class="brand" to="/">
            <img src="~/assets/images/logofp-transparente.png" alt="FluxoPronto Logo" class="logo-image" />
          </NuxtLink>
          <p class="field-hint">O Marketplace Definitivo para Workflows n8n. Templates profissionais para acelerar sua operação.</p>
        </div>
        <div class="footer-col">
          <h4>Navegação</h4>
          <ul>
            <li><NuxtLink to="/" class="hover-underline">Home</NuxtLink></li>
            <li><NuxtLink to="/marketplace" class="hover-underline">Marketplace</NuxtLink></li>
            <li><NuxtLink to="/vender" class="hover-underline">Vender na Plataforma</NuxtLink></li>
            <li><NuxtLink to="/como-funciona" class="hover-underline">Como funciona</NuxtLink></li>
            <li><NuxtLink to="/sobre" class="hover-underline">Sobre</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Minha Conta</h4>
          <ul>
            <li><NuxtLink to="/minha-conta/dashboard" class="hover-underline">Meu Painel</NuxtLink></li>
            <li><NuxtLink to="/minha-conta/meus-fluxos" class="hover-underline">Meus Fluxos</NuxtLink></li>
            <li><NuxtLink to="/minha-conta/historico-compras" class="hover-underline">Minhas Compras</NuxtLink></li>
            <li><NuxtLink to="/painel-vendedor/dashboard" class="hover-underline">Painel de Vendedor</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Suporte</h4>
          <ul>
            <li><NuxtLink to="/faq" class="hover-underline">FAQ</NuxtLink></li>
            <li><NuxtLink to="/contato" class="hover-underline">Contato</NuxtLink></li>
             <li><NuxtLink to="/diferenciais" class="hover-underline">Diferenciais</NuxtLink></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><NuxtLink to="/termos-de-uso" class="hover-underline">Termos de Uso</NuxtLink></li>
            <li><NuxtLink to="/politica-de-privacidade" class="hover-underline">Política de Privacidade</NuxtLink></li>
          </ul>
        </div>
      </div>
      <div class="container footer-bottom">
        <p>© {{ new Date().getFullYear() }} FluxoPronto. Todos os direitos reservados.</p>
      </div>
    </footer>
</template>

<style scoped>
/* Footer */
.site-footer {
  border-top: 1px solid var(--border);
  background: var(--surface-1);
  color: var(--text-2);
  padding: 56px 0 0;
  margin-top: auto; /* Garante que ele fique no final */
}
.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
  gap: 48px;
}
.footer-brand .logo-image {
  height: 32px;
  width: auto;
  margin-bottom: 16px;
}
.footer-brand p {
  max-width: 320px;
  font-size: 0.95rem;
}
.footer-col h4 {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--text-1);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.footer-col ul {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 12px;
}
.footer-col a {
  text-decoration: none;
  color: var(--text-2);
  transition: color .2s ease;
  font-size: 0.95rem;
}
.footer-col a:hover {
  color: var(--text-1);
}
.footer-bottom {
  border-top: 1px solid var(--border);
  padding-block: 24px;
  margin-top: 56px;
}
.footer-bottom p {
  font-size: 0.9rem;
  text-align: center;
  color: var(--text-3);
}

@media (max-width: 992px) {
  .footer-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
  .footer-brand {
    grid-column: 1 / -1; /* Ocupa a linha inteira */
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 600px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
