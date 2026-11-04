/* ============================================================
   Ordem de precedência, toques de apito e "boys" (Marinharia).
   Conteúdo doutrinário público (Cerimonial da Marinha, Portaria 368/MB/2016, e Normas do Cerimonial Público),
   sem dado do navio, por isso fica no código e funciona sem internet.
   Fontes: "Bizuário de Cerimonial e Ordem de Precedência" (de bolso) e "Cartão de Toques de Apito".
   O som do apito é sintetizado no aparelho (Web Audio), só para memorizar o ritmo.
   ============================================================ */
(function(){
"use strict";

/* ---------- Toques (Cartão de Toques de Apito) ----------
   tr: trinado de abertura (TL longo, TC curto). x: quantas vezes o toque é dado.
   s: LA nota aguda, MI nota grave, vogal repetida = nota mais longa, # = pausa, (4X) = repete o trecho anterior. */
const TOQUES = [
  {id:"pr", n:"Presidente da República", tr:"TL", x:7, s:"LAA MII LAA MI", boys:8, obs:"Toque próprio do Presidente (art. 6-1-7). Recebe as honras de Almirante de Esquadra ou maiores, por isso 8 boys."},
  {id:"s19", n:"Autoridades com salva de 19 tiros", sub:"Toque de Ministro de Estado", tr:"TL", x:5, s:"LAAA MII LAAA MI", boys:8, obs:"Vale para todo o grupo “Toque de Ministro de Estado” da ordem de precedência: Almirante, Vice-Presidente, Ministros, Comandantes do Exército e da Aeronáutica, Governadores e outros."},
  {id:"cm", n:"Comandante da Marinha", tr:"TL", x:1, s:"LAAA MIII LAAA MI (4X) LAAA MIIII LAAA MI LAAAA", boys:8, obs:"O primeiro trecho vai 4 vezes; o último fecha o toque."},
  {id:"cema", n:"CEMA e CON", sub:"Chefe do Estado-Maior da Armada e Comandante de Operações Navais", tr:"TL", x:3, s:"LA LAAAA LAAAA LA MI # # LA LAAAA MI", boys:8},
  {id:"comemch", n:"ComemCh", sub:"Comandante em Chefe da Esquadra", tr:"TL", x:3, s:"LAA LAA LAA MI # # LAAA LAAAA MI", boys:8},
  {id:"ogcf", n:"Oficial-General Comandante de Força", tr:"TL", x:3, s:"LAA LAA LAA MI LAA MI", boys:"8 ou 6", obs:"Mesmas notas do Oficial Superior Comandante de Força, mas com trinado longo e 3 vezes. O Comandante de Força pode receber este toque também em OM não subordinadas (art. 5-1-5)."},
  {id:"ogc", n:"Oficial-General Comandante", sub:"Só na OM que ele comanda", tr:"TL", x:3, s:"LAAAA LAAAA LAAAA LA MI LA # LAAAA MI", boys:"8 ou 6", obs:"Toque de Comandante só no navio ou estabelecimento em que exerce o comando (art. 5-1-5)."},
  {id:"og", n:"Oficial-General", sub:"Almirante de Esquadra, Vice e Contra-Almirante", tr:"TL", x:3, s:"LAAAA LAAAA LA MI # LAA MI", boys:"8 ou 6", obs:"8 boys para Almirante de Esquadra e Vice-Almirante; 6 para Contra-Almirante."},
  {id:"oscf", n:"Oficial Superior Comandante de Força", tr:"TC", x:2, s:"LAA LAA LAA MI LAA MI", boys:4},
  {id:"osc", n:"Oficial Superior Comandante", sub:"Só na OM que ele comanda", tr:"TC", x:2, s:"LAAAA LAAAA LAAAA LA MI LA # LAAAA MI", boys:4, obs:"Mesmas notas do Oficial-General Comandante, com trinado curto e 2 vezes."},
  {id:"os", n:"Oficial Superior", sub:"CMG, CF e CC", tr:"TC", x:1, s:"LA MI LAA MI # # # LA MI LA # LAAAA MI", boys:4},
  {id:"imed", n:"Imediato", sub:"Na OM em que serve", tr:"TC", x:2, s:"MI LA # # # # LAAA MI", boys:"posto", obs:"Honras de portaló só na primeira chegada e na última saída do dia. Nas outras vezes é saudado pelo oficial de serviço, sem guarda, toques e boys (art. 5-3-4). Os boys seguem o posto."},
  {id:"oic", n:"Oficial Intermediário Comandante", sub:"Só na OM que ele comanda", tr:"TC", x:1, s:"LAA MII # # LAA MIII MIII # # LAA MIII # LAAA", boys:2},
  {id:"oi", n:"Oficial Intermediário", sub:"Capitão-Tenente", tr:"TC", x:1, s:"LA MI # # # LAAA MI # MI LAA LAAAA MI", boys:2},
  {id:"osub", n:"Oficial Subalterno", sub:"Primeiro e Segundo-Tenente", tr:"TC", x:2, s:"LAAA MI # # LA MI", boys:2}
];
const EXTRA = [
  {id:"band", n:"Bandeira Nacional", tr:"", x:1, s:"LAA MII LAAA (6X) LAA MII LAAA MI", obs:"Do bizuário de bolso: o trecho vai 6 vezes e “LAA MII LAAA MI” encerra."}
];
const TQ = id => TOQUES.concat(EXTRA).find(t => t.id === id);

/* ---------- Postos da Marinha, do mais antigo ao mais moderno ---------- */
const POSTOS = [
  {n:"Almirante", ab:"Alte", c:"Oficial-General", boys:8, t:"s19", obs:"Posto de tempo de guerra. No bizuário está no grupo do toque de Ministro de Estado."},
  {n:"Almirante de Esquadra", ab:"AE", c:"Oficial-General", boys:8, t:"og", cmd:"ogc", cf:"ogcf"},
  {n:"Vice-Almirante", ab:"VA", c:"Oficial-General", boys:8, t:"og", cmd:"ogc", cf:"ogcf"},
  {n:"Contra-Almirante", ab:"CA", c:"Oficial-General", boys:6, t:"og", cmd:"ogc", cf:"ogcf"},
  {n:"Capitão de Mar e Guerra", ab:"CMG", c:"Oficial Superior", boys:4, t:"os", cmd:"osc", cf:"oscf"},
  {n:"Capitão de Fragata", ab:"CF", c:"Oficial Superior", boys:4, t:"os", cmd:"osc", cf:"oscf"},
  {n:"Capitão de Corveta", ab:"CC", c:"Oficial Superior", boys:4, t:"os", cmd:"osc", cf:"oscf"},
  {n:"Capitão-Tenente", ab:"CT", c:"Oficial Intermediário", boys:2, t:"oi", cmd:"oic"},
  {n:"Primeiro-Tenente", ab:"1ºTen", c:"Oficial Subalterno", boys:2, t:"osub"},
  {n:"Segundo-Tenente", ab:"2ºTen", c:"Oficial Subalterno", boys:2, t:"osub"}
];
const CARGOS = [
  {n:"Comandante da Marinha", t:"cm"},
  {n:"Chefe do Estado-Maior da Armada (CEMA)", t:"cema"},
  {n:"Comandante de Operações Navais (CON)", t:"cema"},
  {n:"Comandante em Chefe da Esquadra (ComemCh)", t:"comemch"}
];

/* ---------- Ordem de precedência (bizuário de bolso), por grupo de toque ---------- */
const MB = /Almirante|Capitães-de-Mar|Capitães-de-Fragata|Capitães-de-Corveta|Capitães-Tenentes|Patrono da Marinha/;
const GRUPOS = [
  {id:"min", n:"Toque de Ministro de Estado", t:"s19", boys:"8", nota:"Autoridades acima do Almirante de Esquadra recebem as honras dele, exceto salva (art. 6-1-1).", itens:[
    "Patrono da Marinha", "Almirante", "Vice-Presidente da República", "Presidente do Congresso Nacional", "Presidente do Supremo Tribunal Federal", "Presidente do Senado Federal", "Presidente da Câmara dos Deputados", "Ministro de Estado", "Comandante do Exército", "Comandante da Aeronáutica", "Governador de Unidade da Federação", "Embaixador do Brasil"]},
  {id:"gen", n:"Toques de Oficial-General", t:"og", boys:"8 ou 6", nota:"8 boys para Almirante de Esquadra e Vice-Almirante (e quem tem precedência igual); 6 para Contra-Almirante e equivalentes.", itens:[
    "Cardeais", "Presidente da Assembleia Legislativa", "Presidente do Tribunal de Justiça", "Vice-Governador", "Senadores", "Deputados Federais", "Almirantes-de-Esquadra", "Vice-Almirantes", "Contra-Almirantes", "Generais-de-Exército", "Tenentes-Brigadeiros", "Prefeito da Capital estadual em que se processa a cerimônia", "Generais-de-Divisão", "Majores-Brigadeiros", "Chefes de Igrejas sediados no Brasil", "Arcebispos católicos ou equivalentes de outras religiões", "Reitores das Universidades Federais", "Personalidades inscritas no Livro do Mérito", "Prefeito da cidade em que se processa a cerimônia", "Presidente da Câmara Municipal da cidade em que se processa a cerimônia", "Secretários de Estado",
    "Juiz de Direito da Comarca em que se processa a cerimônia", "Prefeitos das cidades de mais de um milhão (1.000.000) de habitantes", "Generais-de-Brigada", "Brigadeiros", "Presidente do Tribunal Regional Eleitoral", "Procurador Regional da República no Estado", "Procurador-Geral do Estado", "Presidente do Tribunal Regional do Trabalho", "Presidente do Tribunal de Contas", "Presidente do Tribunal de Alçada", "Chefe da Agência do Serviço Nacional de Informações", "Superintendentes dos Órgãos Federais", "Presidentes dos Institutos e Fundações Nacionais", "Presidentes dos Conselhos e Comissões Federais", "Reitores das Universidades Estaduais e Particulares", "Membros do Conselho Nacional de Pesquisas", "Membros do Conselho Federal de Educação", "Membros do Conselho Federal de Cultura",
    "Presidentes das Entidades Autárquicas, Sociedades de Economia Mista e Empresas Públicas de âmbito nacional", "Presidentes das Confederações Patronais e de Trabalhadores de âmbito nacional", "Diretores do Banco Central do Brasil", "Diretores do Banco do Brasil", "Diretores do Banco Nacional de Desenvolvimento Econômico", "Diretores do Banco Nacional de Habitação", "Cônsules-Gerais estrangeiros", "Civis agraciados com insígnia da Ordem do Mérito Naval, salvo se pelo cargo tiverem outras honras: Grã-cruz – Almirante de Esquadra; Grande-oficial – Vice-Almirante; Comendador – Contra-Almirante", "Bispos católicos ou equivalentes de outras religiões", "Membros da Academia Brasileira de Letras"]},
  {id:"sup", n:"Toques de Oficial Superior", t:"os", boys:"4", itens:[
    "Capitães-de-Mar-e-Guerra", "Coronéis do Exército", "Coronéis da Aeronáutica", "Deputados Estaduais", "Chefe da Casa Militar do Governador", "Chefe da Casa Civil do Governador", "Comandante da Polícia Militar do Estado", "Desembargadores do Tribunal de Justiça", "Prefeitos das cidades de mais de 500.000 (quinhentos mil) habitantes", "Delegados dos Ministérios", "Cônsules estrangeiros", "Consultor-Geral do Estado", "Juízes do Tribunal Regional Eleitoral", "Juízes do Tribunal Regional do Trabalho", "Presidentes das Câmaras Municipais da Capital e das cidades de mais de 1.000.000 (um milhão) de habitantes", "Juiz Federal", "Juízes do Tribunal de Contas", "Juízes do Tribunal de Alçada", "Procurador Regional do Trabalho", "Auditores da Justiça Militar",
    "Presidentes dos Institutos e Fundações Regionais e Estaduais", "Presidentes das Entidades Autárquicas, Sociedades de Economia Mista e Empresas Públicas de âmbito regional ou estadual", "Diretores de Faculdades Federais", "Monsenhores católicos ou equivalentes de outras religiões", "Capitães-de-Fragata", "Tenentes-Coronéis do Exército", "Tenentes-Coronéis da Aeronáutica", "Presidentes das Federações Patronais e de Trabalhadores de âmbito regional ou estadual", "Presidentes das Câmaras Municipais das cidades de mais de 500.000 (quinhentos mil) habitantes", "Juízes de Direito", "Procurador Regional do Trabalho", "Auditores da Justiça Militar", "Auditores do Tribunal de Contas", "Promotores Públicos", "Diretores das Faculdades Estaduais e Particulares", "Vice-Cônsules estrangeiros",
    "Chefes de Departamento das Universidades Federais", "Prefeitos das cidades de mais de 100.000 (cem mil) habitantes", "Capitães-de-Corveta", "Majores do Exército", "Majores da Aeronáutica", "Diretores de Departamentos das Secretarias", "Presidentes dos Conselhos Estaduais", "Chefes de Departamentos das Universidades Estaduais e Particulares", "Presidentes das Câmaras Municipais das cidades de mais de 100.000 (cem mil) habitantes", "Professores de Universidade", "Demais Prefeitos Municipais", "Cônegos católicos ou equivalentes de outras religiões"]},
  {id:"int", n:"Oficial Intermediário", t:"oi", boys:"2", itens:[
    "Capitães-Tenentes", "Capitães do Exército", "Capitães da Aeronáutica", "Presidentes das demais Câmaras Municipais", "Diretores de Repartição", "Diretores de Escola de Ensino Secundário", "Vereadores Municipais", "Civis agraciados com insígnia da Ordem do Mérito Naval, salvo se pelo cargo tiverem outras honras: Cavaleiro – Oficial Intermediário"]}
];

const PR = {aba:"postos", q:"", play:null};
const g$ = s => document.querySelector(s);

/* ---------- Notação ---------- */
function tokens(s){ return s.split(/\s+/).filter(Boolean); }
function tokHtml(s, pre){
  return tokens(s).map((t, k) => {
    const m = /^(LA|MI)(A*|I*)$/.exec(t);
    if (m) { const v = 1 + m[2].length; return `<span class="pr-tk ${m[1] === "LA" ? "la" : "mi"}" data-k="${pre}-${k}" style="--v:${v}">${t}</span>`; }
    if (t === "#") return `<span class="pr-tk pa" data-k="${pre}-${k}" title="pausa">#</span>`;
    const r = /^\((\d+)X\)$/.exec(t); if (r) return `<span class="pr-tk rep">×${r[1]}</span>`;
    return `<span class="pr-tk">${esc(t)}</span>`;
  }).join("");
}
const trTxt = t => t === "TL" ? "trinado longo" : t === "TC" ? "trinado curto" : "";
function boysTxt(b){ return b === "posto" ? "Boys do posto" : `${b} boys`; }

/* Figuras dos boys: duas filas, uma de cada lado do caminho da autoridade. */
function boysSvg(n){
  n = +n || 0; if (!n) return "";
  const half = n / 2, w = 16 + half * 18;
  const pess = (x, y) => `<g transform="translate(${x} ${y})"><circle cx="0" cy="-7" r="3.2" fill="#F3F6FA"/><rect x="-4" y="-3" width="8" height="10" rx="2.5" fill="#F3F6FA"/><rect x="-4.6" y="-11.4" width="9.2" height="2.4" rx="1" fill="#0B1E31"/></g>`;
  let g = ""; for (let i = 0; i < half; i++) { const x = 12 + i * 18; g += pess(x, 13) + pess(x, 43); }
  return `<svg class="pr-boys" viewBox="0 0 ${w + 14} 54" width="${w + 14}" height="54" aria-hidden="true">${g}<path d="M4 28h${w + 2}" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 4"/><path d="M${w + 2} 23l7 5-7 5" fill="var(--accent)"/></svg>`;
}

const btnLbl = (lbl, on) => lbl === " " ? "" : (lbl || (on ? "Parar" : "Ouvir"));
function playBtn(id, label){
  const on = PR.play === id;
  return `<button type="button" class="btn sm pr-play${on ? " on" : ""}${label === " " ? " ico" : ""}" data-act="prPlay" data-arg="${id}" data-lbl="${esc(label || "")}" aria-pressed="${on}" aria-label="${on ? "Parar" : "Ouvir"} o toque">${on ? PSTOP : PPLAY}${btnLbl(label, on)}</button>`;
}
const PPLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12-7.5z" fill="currentColor"/></svg>';
const PSTOP = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>';

function toqueCard(t){
  const b = t.boys;
  return `<div class="card pr-tq" id="pr-t-${t.id}">
    <div class="pr-tq-h"><div style="flex:1;min-width:0"><b>${esc(t.n)}</b>${t.sub ? `<div class="sub">${esc(t.sub)}</div>` : ""}</div>${playBtn(t.id)}</div>
    <div class="pr-meta">${t.tr ? `<span class="pill accent">${t.tr} · ${trTxt(t.tr)}</span>` : ""}<span class="pill">${t.x}× o toque</span>${b != null ? `<span class="pill">${boysTxt(b)}</span>` : ""}</div>
    <div class="pr-staff">${t.tr ? `<span class="pr-tk tr" data-k="${t.id}-tr">${t.tr}</span>` : ""}${tokHtml(t.s, t.id)}${t.x > 1 ? `<span class="pr-tk rep">${t.x}×</span>` : ""}</div>
    ${t.obs ? `<p class="sub" style="margin:0;font-size:13.5px">${esc(t.obs)}</p>` : ""}
  </div>`;
}

function viewPostos(){
  const tqLink = (id, txt) => `<button type="button" class="pr-lnk" data-act="prVerToque" data-arg="${id}">${esc(txt || TQ(id).n)} <span class="num">${TQ(id).tr ? TQ(id).tr + " · " : ""}${TQ(id).x}×</span></button>`;
  let circ = "";
  const rows = POSTOS.map((p, i) => {
    const head = p.c !== circ ? `<div class="pr-circ">${esc(p.c === "Oficial-General" ? "Oficiais-Generais" : p.c === "Oficial Superior" ? "Oficiais Superiores" : p.c === "Oficial Intermediário" ? "Oficial Intermediário" : "Oficiais Subalternos")}</div>` : "";
    circ = p.c;
    return `${head}<div class="card pr-posto">
      <div class="pr-posto-h"><span class="sec-n">${i + 1}</span><div style="flex:1;min-width:0"><b>${esc(p.n)}</b><div class="sub">${esc(p.ab)} · ${esc(p.c)}</div></div><div class="pr-nb"><span class="num">${p.boys}</span><small>boys</small></div></div>
      ${boysSvg(p.boys)}
      <div class="pr-tqs"><div class="pr-tql"><small>Toque</small>${tqLink(p.t)}${playBtn(p.t, " ")}</div>
        ${p.cmd ? `<div class="pr-tql"><small>Se for o Comandante, na OM dele</small>${tqLink(p.cmd)}${playBtn(p.cmd, " ")}</div>` : ""}
        ${p.cf ? `<div class="pr-tql"><small>Se for Comandante de Força</small>${tqLink(p.cf)}${playBtn(p.cf, " ")}</div>` : ""}</div>
      ${p.obs ? `<p class="sub" style="margin:0;font-size:13px">${esc(p.obs)}</p>` : ""}
    </div>`;
  }).join("");
  return `<div class="chips pr-resumo">${[["8", "AE e VA"], ["6", "CA"], ["4", "Of. Superior"], ["2", "Intermediário e Subalterno"]].map(([n, q]) => `<div class="chip-v"><small>${q}</small><span>${n} boys</span></div>`).join("")}</div>
    <div class="note">${ic("info")}<span>Os <b>boys</b> formam duas filas no portaló, uma de cada lado, e a autoridade passa entre elas. O número vale para recepção e despedida em visita oficial ou anunciada (art. 5-1-8). Se o convés não comportar, quem recebe pode mandar pôr <b>dois boys</b> junto ao patim inferior da escada (ou da prancha) ou <b>reduzir</b> a quantidade, sempre em <b>número par</b> (art. 5-1-9).</span></div>
    <div class="sec-title"><h2>Cargos com toque próprio</h2></div>
    <div class="col" style="gap:8px">${CARGOS.map(c => `<div class="card pr-cargo"><div style="flex:1;min-width:0"><b>${esc(c.n)}</b><div>${tqLink(c.t, TQ(c.t).tr + " · " + TQ(c.t).x + "× o toque · 8 boys")}</div></div>${playBtn(c.t, " ")}</div>`).join("")}</div>
    <div class="sec-title"><h2>Postos, do mais antigo ao mais moderno</h2></div>
    <div class="col" style="gap:10px">${rows}</div>
    <div class="note warn">${ic("alert")}<span>Se houver a bordo autoridade de <b>maior precedência</b> perto do local das honras, ficam só a guarda e os boys, <b>sem toques</b> (art. 5-1-3).</span></div>`;
}

function viewToques(){
  return `<div class="card col pr-legenda">
      <div class="rl-h">Como ler o toque</div>
      <div class="pr-staff" style="margin:0"><span class="pr-tk tr">TL</span><span class="pr-tk la" style="--v:1">LA</span><span class="pr-tk la" style="--v:3">LAAA</span><span class="pr-tk pa">#</span><span class="pr-tk mi" style="--v:1">MI</span><span class="pr-tk mi" style="--v:3">MIII</span><span class="pr-tk rep">×4</span></div>
      <ul class="ul" style="font-size:14px">
        <li>Todo toque abre com o <b>trinado</b>: <b>TL</b> longo para oficial-general e autoridades, <b>TC</b> curto para os demais.</li>
        <li><b>LA</b> é a nota aguda (em cima) e <b>MI</b> a grave (embaixo). Cada vogal a mais deixa a nota mais longa: LAAAA dura bem mais que LA.</li>
        <li><b>#</b> é uma pausa. O número no fim (3×, 7×) diz quantas vezes o toque inteiro é dado.</li>
        <li>O toque começa no “Abre o toque”, quando a autoridade chega ao patim superior da escada do portaló ou à ponta da prancha (art. 1-3-5).</li>
      </ul>
      <p class="sub" style="margin:0;font-size:12.5px">O som do botão Ouvir é feito no próprio celular, só para pegar o ritmo; não substitui o apito de verdade. No iPhone, tire do modo silencioso para ouvir.</p>
    </div>
    <div class="sec-title"><h2>Toques de cerimonial</h2></div>
    <div class="col" style="gap:10px">${TOQUES.map(toqueCard).join("")}</div>
    <div class="sec-title"><h2>Outros toques</h2></div>
    <div class="col" style="gap:10px">${EXTRA.map(toqueCard).join("")}</div>`;
}

function autRes(){
  const q = norm(PR.q).trim();
  const out = GRUPOS.map(g => {
    const its = g.itens.map((t, i) => ({t, i})).filter(x => !q || norm(x.t + " " + g.n).includes(q));
    if (q && !its.length) return "";
    const tq = TQ(g.t);
    return `<details class="sec pr-grp" id="pr-g-${g.id}" ${q || PR.open === g.id ? "open" : ""}>
      <summary><span class="sec-n">${GRUPOS.indexOf(g) + 1}</span><b>${esc(g.n)}<span class="sub" style="display:block;font-family:var(--f-body);font-weight:500;font-size:12.5px">${g.itens.length} autoridades · ${tq.tr} · ${tq.x}× · ${g.boys} boys</span></b>${ic("down")}</summary>
      <div class="sec-body">
        <div class="pr-staff" style="margin:0"><span class="pr-tk tr">${tq.tr}</span>${tokHtml(tq.s, "g" + g.id)}${tq.x > 1 ? `<span class="pr-tk rep">${tq.x}×</span>` : ""}</div>
        <div class="row" style="gap:8px;flex-wrap:wrap">${playBtn(tq.id, "Ouvir o toque")}<button type="button" class="btn sm ghost" data-act="prVerToque" data-arg="${tq.id}">Ver em Toques</button></div>
        ${g.nota ? `<p class="sub" style="margin:0;font-size:13.5px">${esc(g.nota)}</p>` : ""}
        <ol class="pr-list">${its.map(x => `<li value="${x.i + 1}"${MB.test(x.t) ? ` class="mb"` : ""}>${esc(x.t)}${MB.test(x.t) ? ` <span class="pill accent">MB</span>` : ""}</li>`).join("")}</ol>
      </div></details>`;
  }).join("");
  return out || `<div class="empty">Nada encontrado para “${esc(PR.q)}”.</div>`;
}

function viewAut(){
  return `<p class="sub" style="font-size:14.5px;margin:0">A lista mostra que toque cada autoridade recebe, na ordem do bizuário. Autoridade civil ou de outra Força recebe as honras da autoridade naval de <b>mesma precedência</b>, exceto salva (art. 6-1-1). Na honra de portaló a autoridade civil é anunciada pelo cargo que ocupa.</p>
    <div class="gsearch" style="max-width:none">${ic("search")}<input id="pr-q" type="search" placeholder="Procure o cargo: prefeito, juiz, deputado…" autocomplete="off" value="${esc(PR.q)}" aria-label="Procurar autoridade"></div>
    <div id="pr-aut" class="col" style="gap:10px">${autRes()}</div>`;
}

function viewDatas(){
  const li = a => `<ul class="ul" style="font-size:14.5px">${a.map(x => `<li>${x}</li>`).join("")}</ul>`;
  return `<div class="card col"><div class="rl-h">Grande gala</div>
      ${li(["Aniversário da Independência: <b>7 de setembro</b>", "Proclamação da República: <b>15 de novembro</b>"])}
      <p class="sub" style="margin:0;font-size:14px">Nesses dias:</p>
      ${li(["Embandeiramento em arco nos navios, das 08:00 até o pôr do sol.", "Depois do cerimonial da Bandeira e do Hino Nacional, a banda toca o Hino da Independência ou o da Proclamação da República, conforme a data, cantado por todos.", "Salva de 21 tiros às 12:00, pela estação designada, nas cidades sede de Distrito Naval e Comando Naval."])}</div>
    <div class="card col"><div class="rl-h">Pequena gala</div>
      ${li(["Confraternização Universal: <b>1º de janeiro</b>", "Tiradentes: <b>21 de abril</b>", "Dia do Trabalho: <b>1º de maio</b>", "Batalha Naval do Riachuelo: <b>11 de junho</b>", "Dia da Bandeira: <b>19 de novembro</b>", "Dia do Marinheiro: <b>13 de dezembro</b>", "Natal: <b>25 de dezembro</b>"])}</div>`;
}

function viewPrecedencia(){
  const abas = [["postos", "Postos e boys"], ["toques", "Toques"], ["aut", "Autoridades"], ["datas", "Datas"]];
  const body = {postos:viewPostos, toques:viewToques, aut:viewAut, datas:viewDatas}[PR.aba]();
  return `<button class="back" data-act="marBack">${ic("left")}Marinharia</button>
    <div class="page-h"><span class="eyebrow">Marinharia · Cerimonial</span><h1>Ordem de precedência</h1><p class="sub" style="font-size:15px">Do Almirante ao Segundo-Tenente: o toque de apito de cada um, quantos boys formam no portaló e a precedência das autoridades civis. Funciona sem internet.</p></div>
    <div class="seg seg4 pr-abas" role="group" aria-label="Seções">${abas.map(([k, n]) => `<button type="button" data-act="prAba" data-arg="${k}" aria-pressed="${PR.aba === k}">${n}</button>`).join("")}</div>
    <div id="pr-root" class="col" style="gap:14px">${body}</div>
    <p class="sub" style="font-size:12.5px">Fontes: Bizuário de Cerimonial e Ordem de Precedência, Cartão de Toques de Apito e Cerimonial da Marinha (Portaria nº 368/MB/2016, arts. 1-3-5, 5-1-3 a 5-1-9, 5-3-4, 6-1-1 e 6-1-7).</p>`;
}

/* ---------- Som do apito (Web Audio) ---------- */
let AC = null, CUR = null;
const F_LA = 1760, F_MI = 1318.5, U = 0.13;
function seqOf(t){
  /* Expande (nX): repete o trecho desde o início ou desde o último (nX). */
  const tk = tokens(t.s), body = []; let seg = [];
  tk.forEach((x, k) => { const r = /^\((\d+)X\)$/.exec(x); if (r) { for (let i = 0; i < +r[1]; i++) body.push(...seg); seg = []; } else seg.push({x, k}); });
  body.push(...seg);
  return body;
}
function stopPlay(){
  if (CUR) { try { CUR.g.gain.cancelScheduledValues(0); CUR.g.gain.setTargetAtTime(0, AC.currentTime, 0.02); setTimeout(() => { try { CUR && CUR.g.disconnect(); } catch (e) {} }, 0); } catch (e) {} CUR.timers.forEach(clearTimeout); }
  CUR = null; document.querySelectorAll(".pr-tk.hl").forEach(e => e.classList.remove("hl"));
  const was = PR.play; PR.play = null; if (was) refreshBtns();
}
function refreshBtns(){
  document.querySelectorAll(".pr-play").forEach(b => { const on = PR.play === b.dataset.arg; b.classList.toggle("on", on); b.setAttribute("aria-pressed", on); b.innerHTML = (on ? PSTOP : PPLAY) + btnLbl(b.dataset.lbl, on); });
}
function play(id){
  const t = TQ(id); if (!t) return;
  stopPlay();
  try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
  if (AC.state === "suspended") AC.resume();
  const g = AC.createGain(); g.gain.value = 0.22; g.connect(AC.destination);
  const osc = AC.createOscillator(); osc.type = "sine";
  const env = AC.createGain(); env.gain.value = 0; osc.connect(env); env.connect(g);
  /* um pouco de 2º harmônico deixa mais parecido com apito */
  const o2 = AC.createOscillator(); o2.type = "sine"; const e2 = AC.createGain(); e2.gain.value = 0; o2.connect(e2); e2.connect(g);
  const timers = []; CUR = {g, timers}; PR.play = id;
  let tm = AC.currentTime + 0.08; const t0 = tm;
  const mark = (k, at, dur) => { timers.push(setTimeout(() => { const el = g$(`[data-k="${k}"]`); if (el) { el.classList.add("hl"); setTimeout(() => el.classList.remove("hl"), Math.max(80, dur * 1000 - 30)); } }, (at - AC.currentTime) * 1000)); };
  const note = (f, d) => {
    osc.frequency.setValueAtTime(f, tm); o2.frequency.setValueAtTime(f * 2, tm);
    env.gain.setValueAtTime(0, tm); env.gain.linearRampToValueAtTime(1, tm + 0.012); env.gain.setValueAtTime(1, tm + d - 0.02); env.gain.linearRampToValueAtTime(0, tm + d);
    e2.gain.setValueAtTime(0, tm); e2.gain.linearRampToValueAtTime(0.12, tm + 0.012); e2.gain.setValueAtTime(0.12, tm + d - 0.02); e2.gain.linearRampToValueAtTime(0, tm + d);
  };
  if (t.tr) {
    /* trinado: a nota oscila rápido entre o LA e um tom acima */
    const d = t.tr === "TL" ? 1.5 : 0.65; mark(t.id + "-tr", tm, d);
    env.gain.setValueAtTime(0, tm); env.gain.linearRampToValueAtTime(1, tm + 0.02); env.gain.setValueAtTime(1, tm + d - 0.03); env.gain.linearRampToValueAtTime(0, tm + d);
    for (let s = 0; s < d; s += 1 / 28) { const f = (Math.floor(s * 28) % 2) ? F_LA * 1.12 : F_LA; osc.frequency.setValueAtTime(f, tm + s); o2.frequency.setValueAtTime(f * 2, tm + s); }
    tm += d + 0.35;
  }
  const seq = seqOf(t);
  for (let r = 0; r < t.x; r++) {
    seq.forEach(({x, k}) => {
      if (x === "#") { tm += 0.24; return; }
      const m = /^(LA|MI)(A*|I*)$/.exec(x); if (!m) return;
      const d = 0.06 + U * (1 + m[2].length);
      note(m[1] === "LA" ? F_LA : F_MI, d); mark(t.id + "-" + k, tm, d); tm += d + 0.035;
    });
    tm += 0.45;
  }
  osc.start(t0); o2.start(t0); osc.stop(tm); o2.stop(tm);
  timers.push(setTimeout(() => { if (CUR && CUR.g === g) { CUR = null; PR.play = null; refreshBtns(); } }, (tm - AC.currentTime) * 1000 + 50));
  refreshBtns();
}

/* ---------- Ações ---------- */
Object.assign(ACT, {
  prAba(a){ stopPlay(); PR.aba = a; render(); },
  prPlay(a){ if (PR.play === a) stopPlay(); else play(a); },
  prVerToque(a){ stopPlay(); PR.aba = "toques"; render(); setTimeout(() => { const el = g$("#pr-t-" + a); if (el) { el.scrollIntoView({behavior:"smooth", block:"center"}); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1400); } }, 40); },
  prAbrir(a){ stopPlay(); S.gq = ""; S.tab = "mar"; S.mar = "precedencia"; const [aba, x] = String(a || "").split("|"); PR.aba = aba || "postos"; PR.open = x || null; PR.q = ""; render(); scrollTo(0, 0);
    if (x) setTimeout(() => { const el = g$("#pr-g-" + x) || g$("#pr-t-" + x); if (el) el.scrollIntoView({block:"start"}); }, 40); }
});
document.addEventListener("input", ev => { if (ev.target.id === "pr-q") { PR.q = ev.target.value; const r = g$("#pr-aut"); if (r) r.innerHTML = autRes(); } });
/* Saiu da tela: para o som. */
new MutationObserver(() => { if (PR.play && !g$("#pr-root")) stopPlay(); }).observe(document.getElementById("view") || document.body, {childList:true});

window.viewPrecedencia = viewPrecedencia;
window.PRECEDENCIA_INDEX = () => [
  {tipo:"Marinharia", t:"Ordem de precedência", sub:"Postos, toques de apito e número de boys", txt:"ordem de precedência precedencia antiguidade posto postos boy boys portaló portalo honras toque toques apito trinado cerimonial almirante vice contra capitão de mar e guerra fragata corveta tenente oficial general superior intermediário subalterno comandante imediato", act:"prAbrir", arg:"postos"},
  ...TOQUES.concat(EXTRA).map(t => ({tipo:"Toque de apito", t:"Toque: " + t.n, sub:(t.tr ? t.tr + " · " : "") + t.x + "× o toque" + (t.boys != null ? " · " + boysTxt(t.boys) : ""), txt:t.n + " " + (t.sub || "") + " toque apito " + t.s, act:"prAbrir", arg:"toques|" + t.id})),
  ...GRUPOS.map(g => ({tipo:"Precedência", t:g.n, sub:g.itens.length + " autoridades · " + g.boys + " boys", txt:g.n + " precedência autoridade " + g.itens.join(" "), act:"prAbrir", arg:"aut|" + g.id})),
  {tipo:"Marinharia", t:"Datas festivas", sub:"Grande e pequena gala", txt:"datas festivas grande gala pequena gala embandeiramento em arco salva 21 tiros independência proclamação república tiradentes riachuelo bandeira marinheiro natal", act:"prAbrir", arg:"datas"}
];
})();
