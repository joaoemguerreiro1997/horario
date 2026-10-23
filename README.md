# Horário & Salário: guia de instalação

Precisas de contas gratuitas no Supabase, GitHub, Vercel e Google. Não é preciso cartão de crédito.

## 1. Supabase (login e dados)
1. Cria conta em supabase.com e clica em **New project**. Guarda a palavra-passe da base de dados.
2. Vai a **SQL Editor**, cola o conteúdo de `supabase.sql` e clica **Run**.
3. Vai a **Project Settings > API** e copia o **Project URL** e a **anon public key**.
4. Abre `config.js` e cola esses dois valores no lugar indicado.
5. (Para testar mais depressa) em **Authentication > Providers > Email**, desliga "Confirm email". Em produção, deixa ligado.

## 2. Chave gratuita do Google (leitura da imagem)
Em aistudio.google.com entra com a conta Google, clica em **Get API key** e depois em **Create API key**. Copia a chave. O plano gratuito tem limites diários e por minuto, que chegam para este uso.

## 3. Publicar
1. Em github.com cria um repositório novo e envia todos os ficheiros desta pasta (**Add file > Upload files**).
2. Em vercel.com escolhe **Add New > Project** e importa o repositório.
3. Antes de clicar Deploy, em **Environment Variables** adiciona:
   - `SUPABASE_URL` (o Project URL)
   - `SUPABASE_ANON_KEY` (a anon key)
   - `GEMINI_API_KEY` (a chave do passo 2)
4. Clica **Deploy**. No fim recebes o endereço da app.
5. No Supabase, em **Authentication > URL Configuration**, põe esse endereço em **Site URL** (serve para os emails de confirmação e de recuperar palavra-passe).

## 4. Usar
Envia o endereço aos colegas. Cada um cria a sua conta e vê só os seus dados. No telemóvel, abre o endereço e usa "Adicionar ao ecrã principal".

## Notas
- Notificações: a app avisa às 8h e às 23h30 com a página aberta. Para avisos sempre, usa Definições > Exportar alarmes (.ics) e abre o ficheiro no calendário do telemóvel.
- Privacidade: as regras do `supabase.sql` impedem que um utilizador leia os dados de outro.
- Se aparecer um erro de modelo, define `GEMINI_MODEL` nas variáveis da Vercel com um modelo "Flash" que apareça no Google AI Studio.
- Plano gratuito do Supabase: projetos sem uso durante cerca de uma semana podem ser pausados. Basta reativar no painel.
