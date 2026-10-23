// Lê a imagem do horário com a API gratuita do Google Gemini. A chave fica só no servidor.
// Se um modelo estiver lento ou sobrecarregado, tenta logo o seguinte.
const MODELS = [process.env.GEMINI_MODEL, 'gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite']
  .filter((m, i, a) => m && a.indexOf(m) === i);

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Método inválido' });
    const tk = (req.headers.authorization || '').replace('Bearer ', '');
    const u = tk && await fetch(process.env.SUPABASE_URL + '/auth/v1/user', {
      headers: { apikey: process.env.SUPABASE_ANON_KEY, Authorization: 'Bearer ' + tk }
    });
    if (!u || !u.ok) return res.status(401).json({ error: 'Sessão inválida' });
    const { image, name, month } = req.body || {};
    if (!image) return res.status(400).json({ error: 'Sem imagem' });
    const prompt = `Lê esta imagem de um horário de trabalho. Procura as linhas ou colunas da pessoa chamada "${String(name || '').slice(0, 80) || '(nome desconhecido: usa o nome que parecer mais provável)'}". Devolve APENAS JSON: {"nome":string,"turnos":[{"d":"YYYY-MM-DD","p":"nome do posto","s":"HH:MM","e":"HH:MM","c":["nome de um colega"]}]}. Em "c" põe os nomes dos OUTROS colegas escalados nesse mesmo dia e no mesmo posto (sem incluir a pessoa); se não houver, []. Se o mês ou ano não estiverem visíveis, usa ${String(month || '').slice(0, 7)}. Ignora folgas e dias sem turno.`;
    const body = JSON.stringify({
      contents: [{ parts: [{ inline_data: { mime_type: 'image/jpeg', data: image } }, { text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0 }
    });
    const t0 = Date.now();
    let j = null, last = '';
    for (const model of MODELS) {
      const left = 55000 - (Date.now() - t0);
      if (left < 8000) break;
      try {
        const x = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
          body, signal: AbortSignal.timeout(Math.min(left, 20000))
        });
        const y = await x.json();
        if (x.ok) { j = y; break; }
        last = (y.error && y.error.message) || 'Erro ' + x.status;
        if (x.status === 401 || x.status === 403) break;
      } catch (e) { last = 'A Google demorou demasiado a responder.'; }
    }
    if (!j) return res.status(502).json({ error: last || 'Sem resposta da Google. Tenta daqui a pouco.' });
    const t = (((j.candidates || [])[0] || {}).content || { parts: [] }).parts.map(p => p.text || '').join('');
    try { return res.status(200).json(JSON.parse(t.slice(t.indexOf('{'), t.lastIndexOf('}') + 1))); }
    catch (e) { return res.status(502).json({ error: 'Resposta inesperada, tenta outra imagem' }); }
  } catch (e) {
    return res.status(500).json({ error: 'Erro no servidor: ' + String(e.message || e).slice(0, 150) });
  }
};
