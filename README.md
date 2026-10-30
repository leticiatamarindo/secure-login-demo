# secure-login-demo

Protótipo de login com foco demonstrativo em práticas de Secure by Design e mitigação de vulnerabilidades do OWASP Top 10.

O secure-login-demo é um protótipo de software web desenvolvido para a disciplina de Projeto Aplicado: Práticas de Mercado. O objetivo deste projeto é simular um ambiente de mercado real, aplicando rigorosamente os conceitos de Secure by Design e Secure by Default em todas as fases do ciclo de vida da aplicação.

Este repositório documenta a criação de um fluxo de autenticação seguro e a mitigação ativa de três vulnerabilidades listadas no OWASP Top 10:2025. Além do código-fonte, o projeto abrange a configuração segura da infraestrutura em nuvem pública (Free Tier) e a automação do fluxo de implantação utilizando uma esteira de CI/CD via GitHub Actions.

# 🛡️ Mitigação de Vulnerabilidades (OWASP Top 10:2025)
Para atender aos requisitos de segurança do Eixo 3, este protótipo mitiga as seguintes vulnerabilidades no Front-end:

# Injection (XSS):

Onde: No arquivo app.js (durante a captura de dados do index.html).

Como previne: Os campos de entrada recebem sanitização básica e as mensagens de erro/sucesso são renderizadas utilizando textContent no lugar de innerHTML, reduzindo o risco de injeção de scripts maliciosos.

# Broken Access Control (Falhas de Controle de Acesso):

Onde: No arquivo dashboard.html e na lógica de validação do app.js.

Como previne: Foi implementada uma checagem de sessão demonstrativa. Se o usuário tentar acessar o painel diretamente pela URL sem a flag de autenticação válida no sessionStorage, ele é imediatamente redirecionado de volta para a tela de login.

# Authentication Failures (Falhas de Identificação):

Onde: No arquivo app.js (durante o evento de login e logout).

Como previne: O sistema rejeita senhas fracas, exigindo alta complexidade (mínimo de 12 caracteres, incluindo maiúscula, minúscula, número e símbolo). Além disso, a função de Logout limpa ativamente os dados sensíveis controláveis pelo aplicativo no armazenamento local.

# 🚀 Como Executar
Abra o arquivo index.html em um navegador moderno. Informe qualquer usuário não vazio e utilize uma senha forte (ex: T3st@Pr0j3ct!). Acesse o painel restrito e utilize o botão Sair para testar o encerramento da sessão e a limpeza de dados da memória.

# ⚠️ Limites de Segurança (Aviso Arquitetural)
Este projeto funciona estritamente no front-end: não há servidor back-end, validação real de credenciais contra um banco de dados ou proteção real de recursos. A flag no sessionStorage pode ser alterada manualmente pelo usuário e não deve ser tratada como autorização definitiva. A senha é validada localmente apenas para demonstrar a rejeição de credenciais fracas e não é armazenada.

As medidas ilustradas visam demonstrar a mentalidade Secure by Design na interface. Em um ambiente de produção real, é imprescindível utilizar autenticação e autorização no servidor, transporte seguro (HTTPS) e gerenciamento criptográfico de sessão em cookies HttpOnly.
