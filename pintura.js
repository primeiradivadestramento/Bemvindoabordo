/* ============================================================
   Corrosão e pintura industrial (Marinharia).
   Guia didático montado a partir do Curso Expedito em Corrosão, Pintura e Proteção Catódica (CPP), apostila e slides.
   Conteúdo técnico geral, sem dado do navio, por isso fica no código e funciona sem internet.
   As fotos ficam em cpp/*.webp (tiradas do próprio curso). A apostila completa (apostila + slides) está nas Apostilas,
   id "corrosao-pintura", e os botões "Na apostila" abrem direto na página.
   ============================================================ */
(function(){
"use strict";

const APO_ID = "corrosao-pintura";
const CP = {aba:"corrosao", q:null, qi:0, ok:0, resp:null};
const CPV = "alm-cpp";
const g$ = s => document.querySelector(s);
const nf1 = (v, d = 1) => (isFinite(v) ? v : 0).toLocaleString("pt-BR", {maximumFractionDigits:d});
const pn = s => { s = String(s == null ? "" : s).trim().replace(/\s/g, ""); if (s.includes(",")) s = s.replace(/\./g, "").replace(",", "."); const v = parseFloat(s); return isFinite(v) ? v : NaN; };

/* ---------- peças de tela ---------- */
const fig = (n, leg, cls = "") => `<figure class="cp-fig ${cls}"><button type="button" class="cp-img" data-act="cpZoom" data-arg="${n}" data-leg="${esc(leg)}" aria-label="Ampliar: ${esc(leg)}"><img src="cpp/${n}.webp" loading="lazy" alt="${esc(leg)}"></button><figcaption>${leg}</figcaption></figure>`;
const apo = (p, t) => `<button type="button" class="btn ghost sm cp-apo" data-act="apoLer" data-arg="${APO_ID}" data-p="${p}">${ic("book")}${t || "Na apostila"} · pág. ${p}</button>`;
const sec = (id, eb, h, body) => `<section class="tn-sec cp-sec" id="cp-${id}"><span class="eyebrow">${eb}</span><h2>${h}</h2>${body}</section>`;
const nota = (t, cls = "", i) => `<div class="note ${cls}">${ic(i || (cls === "bad" ? "x" : cls === "warn" ? "alert" : cls === "good" ? "check" : "bulb"))}<span>${t}</span></div>`;
const p = t => `<p class="cp-p">${t}</p>`;
const lst = L => `<ul class="lst">${L.map(x => `<li>${x}</li>`).join("")}</ul>`;
const menu = L => `<nav class="hmenu" aria-label="Partes desta aba">${L.map(([id, n]) => `<button data-act="jump" data-arg="cp-${id}">${n}</button>`).join("")}</nav>`;

/* ============================================================ CORROSÃO */
const FORMAS = [
  ["uniforme", "Uniforme (generalizada)", "A chapa perde espessura por igual em toda a superfície.", "É a mais fácil de ver e de medir. Com o tempo, a chapa fica fina e perde resistência."],
  ["placas", "Por placas", "Ataca regiões da superfície, não ela toda, e forma escavações em placas.", "Comum em tinta que falhou em manchas: a corrosão avança por baixo de cada falha."],
  ["alveolar", "Alveolar", "Sulcos ou escavações arredondadas, mais largos que fundos.", "Parecem pequenas crateras. Ainda dá para ver o fundo."],
  ["pites", "Puntiforme (pites)", "Pontos pequenos e fundos, com o fundo anguloso e a profundidade maior que o diâmetro.", "A mais traiçoeira: a superfície parece boa, mas o pite pode furar a chapa ou o tubo."],
  ["esfoliacao", "Esfoliação", "Forma camadas paralelas à chapa, que se soltam como folhas.", "Comum em ligas de alumínio."],
  ["intergranular", "Intergranular", "Caminha pelo contorno dos grãos do metal (só se vê no microscópio).", "O metal perde resistência por dentro e pode trincar com pouco esforço."],
  ["transgranular", "Transgranular", "Atravessa os grãos do metal.", "Efeito ainda mais grave que a intergranular: fratura com esforço pequeno."],
  ["sob-tensao", "Sob tensão", "Trinca que aparece onde o metal tem tensão residual (solda, dobra, trabalho a frio) e meio corrosivo.", "Não precisa de carga externa: a tensão já está dentro da peça."],
  ["solda", "Em torno do cordão de solda", "Ataca a zona termicamente afetada (ZTA), ao lado do cordão.", "O calor da solda muda os grãos do metal ali e cria uma pilha com o resto da chapa."]
];
function abaCorrosao(){
  return menu([["oque", "O que é"], ["pilha", "A pilha"], ["tipos-pilha", "Tipos de pilha"], ["meios", "Meios"], ["formas", "Formas"], ["nobreza", "Metais"], ["passiva", "Passivação"]]) +
  sec("oque", "Corrosão", "O que é a corrosão",
    `<div class="cp-split">${fig("casco", "A atmosfera marinha e a água do mar são os meios mais agressivos na área naval.")}<div class="col" style="gap:10px">
    ${p("Corrosão é a <b>deterioração de um material</b>, geralmente metálico, pela ação química ou eletroquímica do meio, com ou sem esforço mecânico junto.")}
    ${p("O aço vem do minério (óxido de ferro). A siderurgia gasta muita energia para tirar o oxigênio dele, e a corrosão é o aço <b>voltando sozinho a ser óxido</b>, a ferrugem. Por isso ela nunca para por conta própria: só se controla.")}
    ${nota("<b>Por que importa:</b> estima-se que cerca de 20% da produção mundial de aço vai para repor material corroído. A bordo, corrosão é chapa fina, tubo furado, equipamento parado e risco de acidente.")}</div></div>
    <div class="cp-duo"><div class="cp-box"><b>Custos diretos</b>${lst(["Substituir peças e chapas", "Manter a proteção (pintura, proteção catódica)", "Manutenção preventiva e corretiva"])}</div><div class="cp-box"><b>Custos indiretos</b>${lst(["Perda de produto (óleo, água, combustível por tubo furado)", "Paradas não programadas", "Perda de eficiência (troca de calor ruim)", "Acidentes"])}</div></div>
    <div class="cp-duo"><div class="cp-box"><b>Corrosão química (seca)</b>${lst(["Alta temperatura, sem água líquida", "Sem troca de elétrons: o metal reage direto com o meio", "Ex.: oxidação em fornos e caldeiras"])}</div><div class="cp-box"><b>Corrosão eletroquímica</b>${lst(["Com água líquida (umidade, chuva, mar)", "Temperatura ambiente", "Forma uma pilha, com corrente de elétrons", "<b>É a que acontece no navio</b>"])}</div></div>
    ${apo(3)}`) +
  sec("pilha", "Como acontece", "A pilha de corrosão",
    `${p("Toda corrosão do dia a dia é uma <b>pilha</b>. Ela só funciona com os <b>quatro</b> elementos juntos. Tire um e a corrosão para: é nisso que se baseiam a pintura e a proteção catódica.")}
    <div class="cp-pilha">${pilhaSvg()}<div class="cp-pilha-l">
      <div><b class="bad">Ânodo</b><span>Onde o metal <b>perde elétrons</b> e se desfaz. É aqui que aparece a corrosão.</span></div>
      <div><b class="good">Cátodo</b><span>Onde os elétrons são consumidos (redução). Fica protegido.</span></div>
      <div><b class="blue">Eletrólito</b><span>A água com sais que conduz os íons: água do mar, umidade com sal, condensação.</span></div>
      <div><b>Ligação elétrica</b><span>O próprio metal, ou dois metais encostados, levando os elétrons do ânodo ao cátodo.</span></div></div></div>
    ${nota("<b>A tinta trabalha isolando o eletrólito</b> da chapa. A proteção catódica trabalha <b>transformando o casco inteiro em cátodo</b>, e quem vira ânodo e se gasta é o zinco ou o alumínio.", "good", "bulb")}
    ${apo(5)}`) +
  sec("tipos-pilha", "Onde a pilha se forma", "Tipos de pilha",
    `<div class="cp-cards">
      <div class="cp-card">${fig("galv-parafuso", "Parafuso corroído pela pilha galvânica.")}<b>Galvânica (metais diferentes)</b><span>Dois metais diferentes encostados, com água entre eles. O menos nobre vira ânodo e corrói. Quanto mais distantes na tabela de nobreza, pior.</span></div>
      <div class="cp-card">${fig("acao-local", "Pilha de ação local: impurezas no mesmo metal.")}<b>Ação local</b><span>A mais comum: o mesmo metal com regiões diferentes (impurezas, inclusões, tensões, acabamento, solda). Cada diferença vira uma pilha pequena.</span></div>
      <div class="cp-card">${fig("ativa-passiva", "Pilha ativa-passiva: película protetora danificada.")}<b>Ativa-passiva</b><span>Inox, alumínio e titânio têm uma película protetora. Se ela é riscada ou atacada por cloreto (sal), o ponto exposto vira ânodo pequeno contra um cátodo enorme, e aparece corrosão localizada (pite).</span></div>
      <div class="cp-card">${fig("fresta", "Corrosão em fresta, entre peças sobrepostas.")}<b>Concentração (frestas)</b><span>Em frestas com líquido, a diferença de concentração de íons entre o fundo e a borda cria a pilha. A borda corrói.</span></div>
      <div class="cp-card">${fig("aeracao", "Aeração diferencial em válvula.")}<b>Aeração diferencial</b><span>O mesmo metal, no mesmo eletrólito, com mais oxigênio num ponto que no outro. Acontece em linha d'água, sob depósitos, sujeira e água parada.</span></div>
    </div>${apo(6)}`) +
  sec("meios", "Onde está o eletrólito", "Meios corrosivos",
    `<div class="cp-split">${fig("meio-marinho", "Água do mar e atmosfera marítima: os dois meios mais agressivos na área naval.")}<div class="col" style="gap:10px">
    ${lst(["<b>Atmosfera:</b> umidade + sais + gases + poeira. Rural é a mais branda; industrial e urbana têm enxofre (SO₂), que vira ácido sulfúrico.", "<b>Marinha:</b> partículas de sal (NaCl) trazidas pelo vento e depositadas em tudo.", "<b>Água do mar:</b> muito sal dissolvido (cloreto, sódio, sulfato, magnésio).", "<b>Solos, rios e produtos químicos.</b>"])}
    ${nota("<b>Calor acelera:</b> a corrosão atmosférica pode dobrar a cada 10 °C a mais. Também pesam a umidade relativa, o vento, o sol e a chuva. Ambiente interno mal ventilado e úmido corrói muito.", "warn")}</div></div>${apo(11)}`) +
  sec("formas", "Reconhecer no costado", "Formas de corrosão",
    `${p("Saber a forma ajuda a achar a causa. Toque na foto para ampliar.")}
    <div class="cp-cards">${FORMAS.map(([n, t, d, o]) => `<div class="cp-card">${fig(n, t)}<b>${t}</b><span>${d}</span><small>${o}</small></div>`).join("")}</div>
    <div class="cp-duo">${fig("formas1", "Chapa sem corrosão e as formas mais comuns.", "light")}${fig("formas2", "Outras formas: filiforme, empolamento pelo hidrogênio, solda e esfoliação.", "light")}</div>
    ${lst(["<b>Filiforme:</b> filamentos finos e rasos que andam por baixo da tinta, em várias direções, sem se cruzar. Aparece com umidade acima de 85% e tinta riscada ou muito permeável.", "<b>Empolamento pelo hidrogênio:</b> o hidrogênio entra no aço (por exemplo, de eletrodo úmido na solda), acumula em defeitos e estufa a chapa por dentro."])}
    ${apo(13)}`) +
  sec("nobreza", "Quem corrói quem", "Metais mais e menos nobres",
    `${p("Na água do mar, quando dois metais se encostam, <b>o de cima da lista corrói e protege o de baixo</b>. É por isso que zinco, alumínio e magnésio são usados como anodo de sacrifício.")}
    <div class="cp-nob">${[["Magnésio", "a"], ["Zinco", "a"], ["Alumínio", "a"], ["Aço carbono e ferro fundido", "m"], ["Aço inox ativo", "m"], ["Chumbo e estanho", "m"], ["Latão, cobre e bronze", "m"], ["Aço inox passivo", "n"], ["Titânio", "n"], ["Grafite", "n"], ["Ouro e platina", "n"]].map(([n, c], i) => `<div class="cp-nob-i ${c}"><span class="num">${i + 1}</span>${n}</div>`).join("")}</div>
    <div class="cp-nob-legend"><span>Menos nobre: corrói (ânodo)</span><span>Mais nobre: protegido (cátodo)</span></div>
    ${nota("<b>Na prática:</b> parafuso de aço em peça de latão, bronze ou inox corrói rápido. Aço junto de alumínio, o alumínio sofre. Isole os metais diferentes (arruela, bucha ou fita isolante) ou use o mesmo material.", "warn")}
    ${apo(108, "Nos slides")}`) +
  sec("passiva", "A ferrugem que protege", "Passivação",
    `<div class="cp-split">${fig("corten", "Aço patinável (Cor-Ten): a pátina protege.")}<div class="col" style="gap:10px">
    ${p("Alguns metais formam uma <b>película fina de óxido</b> que fecha a superfície e quase para a corrosão: cromo, níquel, titânio, alumínio, aço inox e aço patinável (Cor-Ten).")}
    ${p("O aço inox tem no mínimo 10,5% de cromo. O cromo reage com o oxigênio do ar e forma a camada de óxido de cromo, que se refaz sozinha se for riscada, desde que haja oxigênio.")}
    ${nota("<b>Cuidado com o cloreto:</b> o sal da água do mar ataca a película do inox e do alumínio e abre pites. Inox em fresta, sem oxigênio, também perde a proteção. Inox não é “à prova de tudo” a bordo.", "warn")}</div></div>${apo(19)}`);
}
function pilhaSvg(){
  return `<svg class="cp-svg" viewBox="0 0 320 170" role="img" aria-label="Pilha de corrosão: ânodo, cátodo, eletrólito e ligação">
    <rect x="20" y="70" width="280" height="80" rx="10" fill="rgba(79,163,247,.18)" stroke="rgba(79,163,247,.5)"/>
    <text x="160" y="140" text-anchor="middle" fill="#4FA3F7" font-size="12" font-weight="700">ELETRÓLITO (água com sal)</text>
    <rect x="50" y="40" width="50" height="80" rx="4" fill="#B5652C"/><text x="75" y="34" text-anchor="middle" fill="#F06A5C" font-size="12" font-weight="800">ÂNODO</text>
    <rect x="220" y="40" width="50" height="80" rx="4" fill="#8d949b"/><text x="245" y="34" text-anchor="middle" fill="#3DDC97" font-size="12" font-weight="800">CÁTODO</text>
    <path d="M75 40V14h170v26" fill="none" stroke="#F0CB73" stroke-width="3"/><text x="160" y="10" text-anchor="middle" fill="#F0CB73" font-size="11" font-weight="700">ligação: elétrons →</text>
    <circle cx="62" cy="128" r="3" fill="#F06A5C"/><circle cx="88" cy="132" r="3" fill="#F06A5C"/><circle cx="72" cy="140" r="3" fill="#F06A5C"/>
    <text x="75" y="97" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">Fe → Fe²⁺</text><text x="245" y="97" text-anchor="middle" fill="#fff" font-size="10" font-weight="700">O₂ + H₂O</text></svg>`;
}

/* ============================================================ PREPARO DA SUPERFÍCIE */
const GRAUS = [["a", "A", "Carepa de laminação inteira e aderida, quase sem corrosão."], ["b", "B", "Começou a enferrujar e a carepa está se soltando."], ["c", "C", "A carepa já saiu, há corrosão em toda a área, com poucos pites."], ["d", "D", "Corrosão generalizada com muitos pites e alvéolos."]];
const LIMP = [
  {id:"solvente", g:"Limpeza com solvente", f:"Remove óleo, graxa e sujeira com solvente, desengraxante, detergente ou água. <b>Vem antes de qualquer outra</b>: lixar ou jatear por cima de graxa só espalha a graxa.", em:"Todos", img:"solvente"},
  {id:"st2", g:"St 2 · manual", f:"Escova de aço, raspadeira, espátula e lixa. Tira carepa solta, ferrugem e tinta velha que não estão bem presas. Rende pouco e limpa pouco.", em:"B, C, D", img:"st2"},
  {id:"st3", g:"St 3 · mecânica", f:"Escova rotativa, lixadeira, esmerilhadeira e pistola de agulhas, elétricas ou pneumáticas. Mais forte e mais rápida que a manual. <b>Não pode polir</b> a chapa: brilho de polido tira a aderência.", em:"B, C, D", img:"st3"},
  {id:"sa1", g:"Sa 1 · jato ligeiro (brush-off)", f:"Jato passado rápido, quase uma “escovada”. Tira carepa solta, ferrugem e partículas.", em:"B, C, D", img:"sa1"},
  {id:"sa2", g:"Sa 2 · jato comercial", f:"Jato cuidadoso que remove quase toda a carepa e a ferrugem (o curso cita cerca de 65%). Restos só no fundo dos pites.", em:"B, C, D", img:"sa2"},
  {id:"sa25", g:"Sa 2½ · metal quase branco", f:"Ao fim, 95% da área livre de resíduos, só sombras leves. É o grau pedido na maioria dos esquemas de alto desempenho.", em:"A, B, C, D", img:"sa25"},
  {id:"sa3", g:"Sa 3 · metal branco", f:"Remoção total de carepa, ferrugem e partículas. A chapa fica cinza bem clara e uniforme, sem listras nem sombras.", em:"A, B, C, D", img:"sa3"}
];
const WJ = [["wj1", "WJ-1", "Livre de toda ferrugem, tinta, carepa e material estranho. Aparência de metal branco (Sa 3 / Sa 2½)."], ["wj2", "WJ-2", "95% da área livre de resíduos visíveis; até 5% com manchas dispersas de óxido."], ["wj3", "WJ-3", "2/3 da área livre de resíduos (exceto carepa); 1/3 pode ter manchas de ferrugem e tinta."], ["wj4", "WJ-4", "Remove a carepa solta, a ferrugem e a tinta com pouca aderência."]];
function abaPreparo(){
  return menu([["porque", "Por que preparar"], ["carepa", "Carepa"], ["oxid", "Grau de oxidação"], ["graus", "Graus de limpeza"], ["jato", "Jateamento"], ["hidro", "Hidrojateamento"], ["rug", "Rugosidade"], ["insp", "Inspeção"]]) +
  sec("porque", "Preparo da superfície", "A pintura é tão boa quanto o preparo",
    `<div class="cp-split">${fig("limpeza-abc", "A: chapa contaminada. B: só limpa. C: limpa e com rugosidade, o ideal.", "light")}<div class="col" style="gap:10px">
    ${p("Preparar a superfície é conseguir duas coisas: <b>limpeza</b> (tirar óleo, graxa, sal, ferrugem, carepa e tinta mal aderida) e <b>rugosidade</b> (pequenas ranhuras que dão “unha” para a tinta agarrar).")}
    ${p("Quem escolhe o grau de limpeza é o <b>esquema de pintura</b>: cada tinta pede um preparo mínimo. A tinta mais cara do mundo descasca sobre uma chapa mal preparada.")}</div></div>
    ${nota("Antes de começar: <b>soldas, cantos vivos, respingos e entalhes</b> são onde a corrosão começa. Corrija-os antes de limpar (veja em Inspeção).", "warn")}${apo(20)}`) +
  sec("carepa", "Atenção", "Carepa de laminação não é aço",
    `<div class="cp-duo">${fig("carepa", "Carepa se desprendendo do aço.")}${fig("sobre-carepa", "Tubo pintado sobre carepa: a tinta sai junto com ela.")}</div>
    ${p("A carepa é a casca escura de óxido que se forma quando a chapa é laminada a quente (cerca de 1250 °C) e esfria em contato com o ar. Parece bem presa, mas <b>trinca e se solta</b> com o tempo, com o sol, o frio e a chuva.")}
    ${nota("<b>Errado:</b> pintar por cima da carepa. Quando ela se solta, leva a tinta junto e a chapa fica exposta. A carepa é mais nobre que o aço e ainda acelera a corrosão nas falhas.", "bad")}
    ${fig("carepa-diag", "Como a carepa se desagrega e a chapa passa do grau A ao D (ISO 8501-1).", "light wide")}${apo(121, "Nos slides")}`) +
  sec("oxid", "Como a chapa está antes", "Grau de oxidação (A, B, C e D)",
    `${p("Antes de limpar, compare a chapa com os padrões de foto da norma ISO 8501-1 e diga em que grau ela está. O grau inicial + o grau de limpeza formam o nome do preparo: por exemplo, <b>C Sa 2½</b>.")}
    <div class="cp-graus">${GRAUS.map(([n, G, d]) => `<div class="cp-grau">${fig("grau-" + n, "Grau " + G)}<b>Grau ${G}</b><span>${d}</span></div>`).join("")}</div>${apo(21)}`) +
  sec("graus", "Até onde limpar", "Graus de limpeza",
    `${p("Do mais fraco ao mais completo. A coluna <b>“Usado em”</b> diz em que grau de oxidação aquele preparo faz sentido.")}
    <div class="cp-limp">${LIMP.map(l => `<div class="cp-limp-i">${fig(l.img, l.g)}<div class="col" style="gap:6px"><b>${l.g}</b><span>${l.f}</span><small>Usado em: <b>${l.em}</b></small></div></div>`).join("")}</div>
    ${nota("St 2, St 3 e Sa 1 não se usam em chapa grau A: a carepa inteira e lisa não sai na escova e o resultado engana. Em chapa A, só jato Sa 2½ ou Sa 3.", "warn")}${apo(22)}`) +
  sec("jato", "O preparo mais eficiente", "Jateamento abrasivo",
    `<div class="cp-split">${fig("jato", "Jateamento abrasivo de estrutura.")}<div class="col" style="gap:10px">
    ${p("Abrasivo projetado com ar comprimido em alta velocidade. É o melhor método porque faz as duas coisas de uma vez: <b>limpa tudo</b> e <b>deixa a rugosidade</b> certa para a tinta ancorar.")}
    ${lst(["<b>Abrasivos:</b> granalha de aço (esférica ou angular), escória de fundição (cobre, carvão, níquel), óxido de alumínio, areia e especiais (gelo seco, esponja).", "<b>Equipamento:</b> compressor, separadores de umidade e de óleo do ar, vaso de pressão com abrasivo, mangueira, bico, válvula de controle remoto e capacete com ar puro para o jatista.", "O ar do jato tem que chegar <b>seco e sem óleo</b>: senão contamina a chapa que você acabou de limpar."])}</div></div>
    <div class="cp-duo">${fig("granalha", "Granalha de aço esférica e angular.")}${fig("jato-equip", "Componentes do equipamento de jateamento.", "light")}</div>${apo(26)}`) +
  sec("hidro", "Água em alta pressão", "Hidrojateamento",
    `<div class="cp-split">${fig("hidro", "Hidrojateamento de casco.")}<div class="col" style="gap:10px">
    ${p("Jato de água pressurizada para limpeza profunda. Tira tinta, ferrugem e sal muito bem, mas <b>não cria perfil de rugosidade</b>: aproveita o perfil que a chapa já tinha.")}
    ${lst(["<b>Baixa e média pressão:</b> até 5.000 psi (340 bar)", "<b>Alta pressão:</b> 5.000 a 10.000 psi (340 a 700 bar)", "<b>Ultra-alta pressão (UHP):</b> acima de 25.000 psi (1.700 bar)"])}
    ${nota("<b>Água certa:</b> doce, limpa, pH entre 6,5 e 7,5 e com pouco cloreto. Água do mar no hidrojato deixa sal na chapa.", "warn")}</div></div>
    <div class="cp-graus">${WJ.map(([n, t, d]) => `<div class="cp-grau">${fig(n, t)}<b>${t}</b><span>${d}</span></div>`).join("")}</div>
    <div class="cp-split">${fig("flash-rust", "Flash rust: oxidação rápida depois do hidrojateamento.")}<div class="col" style="gap:10px">${p("<b>Flash rust</b> é a ferrugem fina e alaranjada que aparece minutos depois do hidrojateamento, quando a água seca na chapa limpa.")}${nota("Antes do primer, o flash rust tem que estar <b>no máximo leve</b> (o que a especificação da tinta aceitar). Se avançou, limpe de novo. Por isso o primer vai logo depois da limpeza.", "warn")}</div></div>${apo(27)}`) +
  sec("rug", "A “unha” da tinta", "Perfil de rugosidade",
    `${fig("rugosidade", "Rugosidade excessiva, insuficiente e ideal.", "light wide")}
    <div class="cp-tri"><div class="cp-box bad"><b>Excessiva</b><span>Os picos ficam fora da tinta. A corrosão começa por eles.</span></div><div class="cp-box bad"><b>Insuficiente</b><span>A tinta não ancora e descasca.</span></div><div class="cp-box good"><b>Ideal</b><span>Entre <b>1/4 e 1/3 da espessura total</b> da tinta. Ex.: esquema de 300 µm → perfil de 75 a 100 µm.</span></div></div>
    <div class="cp-split">${fig("rugosimetro", "Rugosímetro de agulha (relógio comparador).", "light")}<div class="col" style="gap:10px">${lst(["<b>Rugosímetro:</b> relógio com agulha. Zera numa placa lisa, apoia na chapa jateada e a agulha desce até o fundo dos vales: mostra a altura do perfil.", "<b>Disco comparador:</b> disco com 5 setores de perfil conhecido (0,5, 1, 2, 3 e 4 mils, cerca de 12,5 a 100 µm). Compara-se com a chapa no olho e no tato.", "1 mil = 1 milésimo de polegada = 25,4 µm."])}</div></div>${apo(23)}`) +
  sec("insp", "Antes e depois", "Inspeção do preparo",
    `<div class="cp-duo"><div class="cp-box"><b>Antes de jatear</b>${lst(["Olhar o estado inicial da chapa e dizer o grau (A, B, C ou D).", "Procurar óleo, graxa e outros contaminantes, e remover com solvente.", "Corrigir soldas e cantos (lista abaixo).", "<b>Jato abrasivo:</b> umidade relativa abaixo de 85% e chapa pelo menos 3 °C acima do ponto de orvalho.", "<b>Hidrojato:</b> água doce, limpa, pH 6,5 a 7,5, pouco cloreto."])}<button type="button" class="btn sm" data-act="cpAba" data-arg="contas|cp-orv" style="align-self:flex-start">${ic("calc")}Calcular o ponto de orvalho</button></div>
    <div class="cp-box"><b>Depois, antes do primer</b>${lst(["Inspecionar a superfície inteira logo antes da tinta de fundo.", "Conferir se o grau de limpeza é o que a especificação pede.", "Superfície limpa, seca e sem contaminante (poeira de jato também).", "Oxidação no máximo leve (flash rust)."])}</div></div>
    <div class="cp-box"><b>Defeitos que precisam sair antes de pintar</b><div class="cp-tags">${["Respingos de solda", "Cordões irregulares e pontiagudos", "Mordeduras no cordão", "Poros e crateras", "Cantos vivos", "Entalhes"].map(x => `<span class="pill">${x}</span>`).join("")}</div><span class="sub">Esmerilhe respingos e pontas e arredonde os cantos. Em canto vivo a tinta escorre e fica fina, e é ali que a ferrugem nasce primeiro.</span></div>
    ${apo(146, "Nos slides")}`);
}

/* ============================================================ PINTURA */
function abaPintura(){
  return menu([["tinta", "A tinta"], ["resinas", "Epóxi e PU"], ["esquema", "Esquema"], ["mistura", "Mistura"], ["aplic", "Aplicação"], ["espessura", "Espessura"], ["termos", "Termos"]]) +
  sec("tinta", "Pintura industrial", "Do que a tinta é feita",
    `<div class="cp-split">${fig("composicao", "Solvente evapora; resina, pigmento e aditivos ficam.", "light")}<div class="col" style="gap:10px">
    ${p("A pintura é a principal proteção contra a corrosão: fácil de aplicar e de manter, barata e ainda serve para sinalizar e identificar.")}
    ${lst(["<b>Resina (veículo sólido):</b> forma o filme e dá aderência, resistência e flexibilidade. Dá o nome à tinta: alquídica, epóxi, poliuretano.", "<b>Pigmento:</b> pó fino que dá cor, cobertura e, nos primers, inibe a corrosão.", "<b>Solvente:</b> dissolve a resina e acerta a viscosidade para aplicar. <b>Evapora</b> e não fica na película.", "<b>Aditivos:</b> menos de 5%: secantes, antiespumantes, antiescorrimento, antiincrustantes, estabilizantes UV…"])}
    ${nota("O que protege é o que <b>fica</b> na chapa (resina + pigmento = sólidos). Por isso “sólidos por volume” é o número que mais importa na ficha técnica.")}</div></div>
    <div class="cp-duo"><div class="cp-box"><b>Monocomponente</b><span>Uma embalagem, pronta para uso (pode precisar diluir para pistola). Ex.: alquídica (esmalte sintético) e acrílica.</span></div><div class="cp-box"><b>Bicomponente</b><span>Duas embalagens (A e B) misturadas na hora: a reação química forma o filme. Ex.: epóxi e poliuretano.</span></div></div>${apo(31)}`) +
  sec("resinas", "Saber o que tem na lata", "Epóxi e poliuretano",
    `<div class="cp-duo"><div class="cp-box"><b>Epóxi</b><span>A resina epóxi sozinha não serve. Ela precisa do <b>agente de cura</b> (o componente B), e é ele que define a tinta:</span>${lst(["<b>Poliamina:</b> dura, aderente, ótima contra produtos químicos, solventes, combustíveis e lubrificantes.", "<b>Poliamida:</b> dura e flexível, ótima contra água e umidade.", "<b>Isocianato:</b> boa aderência em metais não ferrosos (alumínio, galvanizado)."])}</div>
    <div class="cp-box"><b>Poliuretano (PU)</b><span>Resina poliéster ou acrílica curada com isocianato:</span>${lst(["<b>Alifático:</b> o que mais resiste ao sol e ao tempo. É o acabamento de exterior.", "<b>Aromático:</b> seca rápido e adere bem, mas <b>não resiste ao sol</b>: só para interiores."])}</div></div>
    ${nota("<b>Epóxi no sol calcina</b> (vira pó e perde a cor). No exterior, o epóxi protege e o PU alifático vai por cima para aguentar o sol.", "warn")}
    <button type="button" class="btn ghost sm" data-act="marOpen" data-arg="tintas" style="align-self:flex-start">${ic("roller")}Ver as tintas do paiol e o que vai sobre o quê</button>${apo(32)}`) +
  sec("esquema", "Camada por camada", "O esquema de pintura",
    `<div class="cp-split">${fig("esquema", "Aço, primer (fundo), intermediária e acabamento.", "light")}<div class="col" style="gap:10px">
    ${lst(["<b>Fundo (primer):</b> a mais importante contra a corrosão. É ela que gruda na chapa e pode ter pigmento inibidor.", "<b>Intermediária (tie coat):</b> dá espessura ao sistema e ajuda a proteger. Mais barata que o fundo.", "<b>Acabamento:</b> enfrenta o meio (sol, chuva, sal) e dá a cor."])}
    ${p("Cada lugar do navio tem o seu esquema: o preparo, a ordem das tintas, a cor e a espessura de cada demão. Na Marinha isso está na ENGENALMARINST 60-01.")}
    <button type="button" class="btn ghost sm" data-act="marOpen" data-arg="esquemas" style="align-self:flex-start">${ic("layers")}Ver os esquemas de pintura</button></div></div>${apo(39)}`) +
  sec("mistura", "Bicomponente", "Mistura, indução e vida útil",
    `<div class="cp-steps">${[["1", "Mexa cada componente", "Homogeneíze a base (A) sozinha antes: o pigmento assenta no fundo."], ["2", "Misture A + B na proporção certa", "Junte o B e mexa até a cor e a consistência ficarem iguais em toda a lata."], ["3", "Dilua se a ficha mandar", "Só o diluente indicado e só o quanto a ficha diz."], ["4", "Indução: 10 a 15 minutos", "Feche a lata e espere. As resinas começam a reagir e a tinta aplica mais homogênea e adere melhor."], ["5", "Use dentro do pot life", "Depois desse tempo a tinta engrossa e endurece. Não adianta diluir para “salvar”."]].map(([n, t, d]) => `<div class="cp-step"><span class="num">${n}</span><div><b>${t}</b><span>${d}</span></div></div>`).join("")}</div>
    ${nota("<b>Pot life</b> (vida útil da mistura) cai com o calor: no sol de convés a tinta “morre” mais rápido. Prepare só o que dá para aplicar.", "warn")}
    <button type="button" class="btn ghost sm" data-act="marOpen" data-arg="tintas" style="align-self:flex-start">${ic("calc")}Calcular a mistura base + componente</button>${apo(40)}`) +
  sec("aplic", "Ferramentas", "Como aplicar",
    `<div class="cp-cards">
      <div class="cp-card">${fig("pincel", "Pincel e trincha.")}<b>Pincel e trincha</b><span>Detalhes, cantos, soldas e recortes. Medidas de 1/2" a 4". Ideal para dar o <b>reforço</b> em cantos e cordões de solda antes da demão geral.</span><small>Limpe logo após o uso: tinta a solvente com aguarrás ou o diluente dela; depois água e sabão.</small></div>
      <div class="cp-card">${fig("rolo", "Pintura a rolo.")}<b>Rolo</b><span>Grandes áreas planas. Dá mais espessura por demão que o pincel e é o melhor <b>com vento</b>, quando a pistola perderia muita tinta. Rolo de lã de carneiro é o melhor para tinta industrial (150 mm para áreas, 50 mm para cantoneiras e tubos).</span></div>
      <div class="cp-card">${fig("pistola", "Pistola convencional (a ar).")}<b>Pistola convencional</b><span>O ar atomiza a tinta, por isso ela precisa ser <b>mais diluída</b>. Resultado: perde muita espessura quando seca e pode ficar com poros, crateras e bolhas. Difícil fazer demão alta (> 100 µm) de uma vez.</span><small>Pressão de 30 a 35 lbf/pol² (2,2 a 2,8 kgf/cm²) para produtos imobiliários.</small></div>
      <div class="cp-card">${fig("airless", "Equipamento airless.")}<b>Airless (sem ar)</b><span>Uma bomba pressuriza a tinta (500 a 3.000 psi) e o bico pulveriza. Sem diluir, aplica demão alta e uniforme, com poucos defeitos e alta produtividade. A melhor qualidade em campo.</span><small>Economia de 20 a 30% de tinta. Nunca aponte a pistola para alguém: o jato perfura a pele.</small></div>
    </div>${apo(35)}`) +
  sec("espessura", "Medir, não adivinhar", "Espessura úmida e seca",
    `<div class="cp-split">${fig("medidor", "Medidores de espessura de película seca.")}<div class="col" style="gap:10px">
    ${lst(["<b>Espessura úmida:</b> medida na hora, com a tinta fresca. Diz ao pintor se ele está aplicando a quantidade certa, enquanto ainda dá para corrigir.", "<b>Espessura seca (EPS):</b> medida depois da cura, com medidor eletrônico (magnético para aço, correntes parasitas para não ferrosos). É o que vale para aceitar a pintura.", "Espessura baixa = proteção fraca. Espessura demais = trinca, escorre, demora a curar e gasta tinta."])}
    <button type="button" class="btn sm" data-act="cpAba" data-arg="contas|cp-epu" style="align-self:flex-start">${ic("calc")}Calcular a espessura úmida</button></div></div>${apo(41)}`) +
  sec("termos", "Vocabulário", "Termos que aparecem nas latas e fichas",
    `<div class="cp-termos">${[["Primer / zarcão", "Primeira demão, com propriedade anticorrosiva."], ["Shop primer", "Primer de fábrica, que a chapa já traz da usina ou do estaleiro."], ["Pot life", "Vida útil depois de misturar A + B."], ["Shelf life", "Validade da tinta na lata fechada."], ["No VOC", "Tinta sem solvente."], ["Low VOC", "Tinta com pouco solvente."], ["TIN-free", "Sem estanho (anti-incrustante sem TBT)."], ["TAR-free", "Sem alcatrão de hulha."], ["Tie coat", "Demão intermediária, de ligação."], ["Sólidos por volume (SV)", "Parte da tinta que fica na chapa depois que o solvente sai."]].map(([t, d]) => `<div class="cp-termo"><b>${t}</b><span>${d}</span></div>`).join("")}</div>${apo(161, "Nos slides")}`);
}

/* ============================================================ CONTAS */
const METODOS = [["pincel", "Pincel", 15], ["rolo", "Rolo", 20], ["conv", "Pistola convencional", 40], ["airless", "Airless", 20]];
const CV = () => Object.assign({eps:"125", sv:"70", dil:"10", met:"rolo", perda:"", area:"50", dem:"2", t:"28", ur:"75", ts:"30", m:"10", c:"740", i:"0,5"}, lsGet(CPV, {}));
function abaContas(){
  const v = CV();
  return menu([["epu", "Espessura úmida"], ["rend", "Rendimento e compra"], ["orv", "Ponto de orvalho"], ["anodo", "Vida do anodo"]]) +
  `<form id="cp-form" class="col" style="gap:22px" onsubmit="return false">` +
  sec("epu", "Contas do curso", "Espessura úmida a aplicar",
    `${p("A ficha da tinta dá a <b>espessura seca</b> pedida e os <b>sólidos por volume</b>. Com isso você sabe quanto medir na tinta fresca.")}
    <div class="cp-formula">EPU = EPS × (100 + % diluição) ÷ SV</div>
    <div class="fields3">${inF("eps", "Espessura seca (EPS)", v.eps, {suf:"µm"})}${inF("sv", "Sólidos por volume", v.sv, {suf:"%"})}${inF("dil", "Diluição", v.dil, {suf:"%"})}</div>
    <div id="cp-o-epu">${outEpu(v)}</div>`) +
  sec("rend", "Quanto pedir ao paiol", "Rendimento e quantidade de tinta",
    `<div class="cp-formula">Rt = SV × 10 ÷ EPS (m²/L) · Rp = Rt × Fa · Litros = Área ÷ Rp × demãos</div>
    <div class="field"><label>Como vai aplicar</label><div class="seg seg4" role="group" aria-label="Método">${METODOS.map(([k, n]) => `<button type="button" data-act="cpMet" data-arg="${k}" aria-pressed="${v.met === k}">${n}</button>`).join("")}</div></div>
    <div class="fields3">${inF("area", "Área a pintar", v.area, {suf:"m²"})}${inF("dem", "Demãos", v.dem)}${inF("perda", "Perdas", v.perda, {suf:"%", ph:String((METODOS.find(m => m[0] === v.met) || METODOS[1])[2]), hint:"Vazio usa a média do método."})}</div>
    <div id="cp-o-rend">${outRend(v)}</div>
    <div class="cp-tbl"><div class="cp-tr h"><span>Método</span><span>Perdas médias</span><span>Fator de aproveitamento</span></div>${[["Pincel", "10 a 20%", "0,8 a 0,9"], ["Rolo", "10 a 30%", "0,7 a 0,9"], ["Pistola convencional", "30 a 50%", "0,5 a 0,7"], ["Airless", "10 a 30%", "0,7 a 0,9"]].map(r => `<div class="cp-tr">${r.map(x => `<span>${x}</span>`).join("")}</div>`).join("")}</div>
    ${p("O <b>rendimento real</b> só se sabe no fim: área pintada ÷ litros gastos. Anote para a próxima faina.")}${apo(43)}`) +
  sec("orv", "Pode pintar agora?", "Ponto de orvalho",
    `${p("Se a chapa estiver fria demais, a umidade do ar condensa nela, mesmo sem dar para ver, e a tinta não adere. A regra: <b>umidade relativa até 85%</b> e <b>chapa pelo menos 3 °C acima do ponto de orvalho</b>.")}
    <div class="fields3">${inF("t", "Temperatura do ar", v.t, {suf:"°C"})}${inF("ur", "Umidade relativa", v.ur, {suf:"%"})}${inF("ts", "Temperatura da chapa", v.ts, {suf:"°C", hint:"Meça com termômetro de contato."})}</div>
    <div id="cp-o-orv">${outOrv(v)}</div>`) +
  sec("anodo", "Proteção catódica", "Vida do anodo de sacrifício",
    `<div class="cp-formula">V (anos) = M × C × 0,85 ÷ (8.760 × I)</div>
    <div class="es-chips" style="margin-bottom:4px">${[["Zinco", "740"], ["Alumínio", "2200"], ["Magnésio", "1100"]].map(([n, c]) => `<button type="button" data-act="cpAnodo" data-arg="${c}" aria-pressed="${pn(v.c) === pn(c)}">${n} · ${c} Ah/kg</button>`).join("")}</div>
    <div class="fields3">${inF("m", "Massa total dos anodos", v.m, {suf:"kg"})}${inF("c", "Capacidade de corrente", v.c, {suf:"Ah/kg"})}${inF("i", "Corrente", v.i, {suf:"A"})}</div>
    <div id="cp-o-anodo">${outAnodo(v)}</div>
    ${p("0,85 é o fator de utilização: o anodo não se gasta até o último grama. O alumínio rende de 2.200 a 2.844 Ah/kg, conforme a liga.")}${apo(52)}`) +
  `</form>`;
}
const big = (k, v, s) => `<div class="cp-big"><small>${k}</small><b class="num">${v}</b>${s ? `<span>${s}</span>` : ""}</div>`;
function outEpu(v){
  const eps = pn(v.eps), sv = pn(v.sv), dil = pn(v.dil) || 0;
  if (!(eps > 0 && sv > 0 && sv <= 100)) return nota("Preencha a espessura seca e os sólidos por volume (de 1 a 100%).");
  const epu = eps * (100 + dil) / sv;
  return `<div class="cp-bigs">${big("Espessura úmida", nf1(epu, 0) + " µm", "Meça na tinta fresca")}${big("Em mils", nf1(epu / 25.4, 1) + " mils")}</div>`;
}
function outRend(v){
  const eps = pn(v.eps), sv = pn(v.sv), m = METODOS.find(x => x[0] === v.met) || METODOS[1], perda = isFinite(pn(v.perda)) ? pn(v.perda) : m[2];
  const area = pn(v.area), dem = pn(v.dem) || 1;
  if (!(eps > 0 && sv > 0)) return nota("Preencha a espessura seca e os sólidos por volume lá em cima.");
  const rt = sv * 10 / eps, fa = Math.max(0, (100 - perda) / 100), rp = rt * fa, lit = area > 0 && rp > 0 ? area / rp * dem : NaN;
  return `<div class="cp-bigs">${big("Rendimento teórico", nf1(rt, 2) + " m²/L")}${big("Rendimento prático", nf1(rp, 2) + " m²/L", m[1] + ", " + nf1(perda, 0) + "% de perda")}${isFinite(lit) ? big("Tinta para comprar", nf1(lit, 1) + " L", nf1(area, 1) + " m² × " + nf1(dem, 0) + " demão" + (dem === 1 ? "" : "s")) : ""}</div>
    ${isFinite(lit) ? `<span class="sub">Com a espessura seca de ${nf1(eps, 0)} µm e ${nf1(sv, 0)}% de sólidos de cada demão. ${lit > 0 ? `Em latas de 3,6 L: ${Math.ceil(lit / 3.6)}; em baldes de 18 L: ${Math.ceil(lit / 18)}.` : ""}</span>` : ""}`;
}
function orvalho(t, ur){ const a = 17.62, b = 243.12, g = Math.log(ur / 100) + a * t / (b + t); return b * g / (a - g); }
function outOrv(v){
  const t = pn(v.t), ur = pn(v.ur), ts = pn(v.ts);
  if (!(isFinite(t) && ur > 0 && ur <= 100)) return nota("Preencha a temperatura do ar e a umidade relativa.");
  const td = orvalho(t, ur), dif = isFinite(ts) ? ts - td : NaN;
  const okUr = ur <= 85, okT = !isFinite(dif) || dif >= 3, ok = okUr && okT && isFinite(dif);
  return `<div class="cp-bigs">${big("Ponto de orvalho", nf1(td, 1) + " °C")}${isFinite(dif) ? big("Chapa acima do orvalho", (dif >= 0 ? "+" : "") + nf1(dif, 1) + " °C", "Mínimo +3 °C") : ""}</div>
    ${!isFinite(dif) ? nota("Informe a temperatura da chapa para saber se pode pintar.") : ok ? nota("<b>Pode pintar.</b> Umidade até 85% e chapa com folga sobre o ponto de orvalho. Confira de novo se o tempo mudar.", "good", "check") : nota(`<b>Não pinte agora.</b> ${!okUr ? "Umidade relativa acima de 85%. " : ""}${!okT ? `A chapa precisa estar a pelo menos ${nf1(td + 3, 1)} °C.` : ""}`, "bad")}`;
}
function outAnodo(v){
  const m = pn(v.m), c = pn(v.c), i = pn(v.i);
  if (!(m > 0 && c > 0 && i > 0)) return nota("Preencha massa, capacidade e corrente.");
  const anos = m * c * 0.85 / (8760 * i);
  return `<div class="cp-bigs">${big("Vida estimada", nf1(anos, 1) + (anos >= 2 ? " anos" : " ano"), nf1(anos * 12, 0) + " meses")}</div>`;
}

/* ============================================================ PROTEÇÃO CATÓDICA */
function abaCatodica(){
  return menu([["pc-oque", "Como funciona"], ["pc-galv", "Anodo de sacrifício"], ["pc-imp", "Corrente impressa"], ["pc-comp", "Comparação"], ["pc-dist", "Onde vão os anodos"]]) +
  sec("pc-oque", "Proteção catódica", "Como funciona",
    `${p("A proteção catódica <b>complementa a pintura</b> nas partes submersas. Toda pintura tem poros e falhas; a proteção catódica cuida exatamente desses pontos, transformando o casco inteiro em <b>cátodo</b> da pilha, que não corrói.")}
    ${lst(["Só funciona <b>mergulhado ou enterrado</b>: precisa estar sempre em contato com o eletrólito (água do mar). Acima da linha d'água, não protege.", "Dois sistemas: <b>galvânico</b> (anodos de sacrifício) e <b>corrente impressa</b> (anodos inertes + retificador). Podem ser usados juntos.", "Na Marinha: ENGENALMARINST 60-06. Normas ABNT: NBR 7403 (carena, caixa de mar, tanques de lastro), NBR 7415 (durante a construção) e NBR 9358 (anodos de zinco)."])}${apo(46)}`) +
  sec("pc-galv", "Sistema galvânico", "Anodo de sacrifício",
    `<div class="cp-duo">${fig("anodos-popa", "Anodos de sacrifício na popa, perto do hélice.")}${fig("anodos", "Anodos de zinco novos.")}</div>
    ${p("Um metal <b>menos nobre</b> (zinco, alumínio ou magnésio) é ligado ao casco. Ele vira ânodo, se gasta no lugar do aço e vai sendo trocado. Não precisa de energia externa. Usado em embarcações de pequeno e médio porte.")}
    <div class="cp-tbl"><div class="cp-tr h"><span>Casco</span><span>Água</span><span>Anodo</span></div>${[["Aço", "Mar", "Zinco ou alumínio"], ["Alumínio", "Mar", "Alumínio"], ["Aço", "Salobra", "Zinco"], ["Alumínio", "Salobra", "Alumínio"], ["Aço", "Doce", "Magnésio"], ["Alumínio", "Doce", "Magnésio"]].map(r => `<div class="cp-tr">${r.map(x => `<span>${x}</span>`).join("")}</div>`).join("")}</div>
    ${nota("<b>Anodo pintado não protege nada.</b> A tinta isola o anodo da água. Na pintura do casco, cubra os anodos e descubra depois. E troque o anodo gasto antes que ele acabe.", "bad")}${apo(46)}`) +
  sec("pc-imp", "Sistema por corrente impressa", "Corrente impressa",
    `<div class="cp-split">${fig("corrente-impressa", "Retificador, anodo inerte e estrutura protegida.", "light")}<div class="col" style="gap:10px">
    ${lst(["Uma fonte de corrente contínua, quase sempre um <b>retificador</b>, injeta corrente no casco pelos anodos inertes (permanentes).", "Anodos de titânio platinizado, nióbio platinizado, grafite, ferro-silício, chumbo-antimônio-prata. Vida de até 20 anos.", "Com pintura nova pede pouca corrente; conforme a pintura envelhece, a corrente sobe.", "Usado em navios de médio e grande porte."])}</div></div>${apo(48)}`) +
  sec("pc-comp", "Qual usar", "Galvânico × corrente impressa",
    `<div class="cp-duo"><div class="cp-box"><b>Anodo de sacrifício</b>${lst(["✔ Não precisa de energia", "✔ Instalação fácil, quase sem risco de falha", "✔ Não interfere em estruturas vizinhas", "✔ Barato para estruturas pequenas (corrente < 5 A)", "✘ A corrente cai com o tempo", "✘ Caro para estruturas grandes", "✘ Precisa trocar os anodos"])}</div>
    <div class="cp-box"><b>Corrente impressa</b>${lst(["✔ Corrente fácil de ajustar", "✔ Vida longa (mais de 20 anos)", "✔ Bom para grandes estruturas (corrente > 5 A)", "✘ Pode causar corrosão em estruturas vizinhas (corrente de fuga)", "✘ Depende de energia elétrica", "✘ Exige manutenção e inspeção regulares"])}</div></div>
    ${p("Regra do curso pela resistividade do eletrólito: acima de 3.000 Ω·cm, corrente impressa; abaixo, anodo de sacrifício (zinco até 1.000 Ω·cm, magnésio acima). A água do mar tem resistividade baixíssima, por isso o anodo de sacrifício funciona tão bem no mar.")}${apo(49)}`) +
  sec("pc-dist", "No casco", "Onde vão os anodos",
    `<div class="cp-split">${fig("anodos-leme", "Anodos distribuídos na popa, junto ao hélice e ao leme.")}<div class="col" style="gap:10px">
    ${lst(["<b>Popa e hélice:</b> a turbulência e o bronze do hélice pedem mais proteção. Cerca de <b>1/3 dos anodos</b> vão nessa região.", "<b>Simetria:</b> distribuídos igualmente nos dois bordos.", "<b>Bolina:</b> evite fixar anodos nas extremidades de vante e de ré da bolina.", "O <b>plano de proteção catódica</b> diz o tipo, o peso, a quantidade, a posição e a fixação de cada anodo."])}</div></div>${apo(171, "Nos slides")}`);
}

/* ============================================================ CERTO × ERRADO */
const CE = [
  {e:"Pintar por cima da carepa de laminação.", c:"Remover a carepa com jato (Sa 2½) antes do primer.", why:"A carepa se solta com o tempo e leva a tinta junto.", img:"sobre-carepa"},
  {e:"Lixar ou jatear por cima de óleo e graxa.", c:"Limpar com solvente ou desengraxante primeiro, depois lavar.", why:"O abrasivo espalha a graxa e a tinta não adere.", img:"solvente"},
  {e:"Polir a chapa com a escova rotativa até brilhar.", c:"Deixar a superfície limpa e áspera.", why:"Superfície polida não tem onde a tinta ancorar.", img:"st3"},
  {e:"Perfil de rugosidade alto demais ou baixo demais.", c:"Perfil entre 1/4 e 1/3 da espessura total da tinta.", why:"Picos altos furam a película; perfil baixo não segura a tinta.", img:"rugosidade", light:1},
  {e:"Pintar com umidade acima de 85% ou com chapa fria.", c:"Medir antes: chapa pelo menos 3 °C acima do ponto de orvalho.", why:"A água condensada fica presa sob a tinta e ela estoura em bolhas.", calc:"orv"},
  {e:"Hidrojatear achando que vai criar rugosidade.", c:"Hidrojato limpa; quem cria perfil é o jato abrasivo.", why:"A água não risca o aço.", img:"hidro"},
  {e:"Deixar o flash rust avançar antes do primer.", c:"Aplicar o primer logo, com oxidação no máximo leve.", why:"A ferrugem nova vira a base da tinta.", img:"flash-rust"},
  {e:"Pintar sobre respingo de solda, canto vivo e mordedura.", c:"Esmerilhar, arredondar cantos e dar reforço a trincha nas soldas.", why:"Em canto vivo a película fica fina e a corrosão começa ali.", img:"solda"},
  {e:"Encostar metais diferentes (aço com latão, inox ou alumínio).", c:"Isolar com arruela, bucha ou fita, ou usar o mesmo material.", why:"Forma pilha galvânica e o menos nobre corrói.", img:"galv-parafuso"},
  {e:"Deixar fresta e água parada.", c:"Vedar frestas e garantir o dreno.", why:"Fresta e água parada criam pilhas de concentração e de aeração.", img:"fresta"},
  {e:"Usar a tinta depois do pot life ou pular a indução.", c:"Misturar só o que vai usar e esperar 10 a 15 minutos com a lata fechada.", why:"A reação já passou do ponto; a tinta não cura direito.", img:"bicomp"},
  {e:"Diluir à vontade para a pistola correr fácil.", c:"Diluir só o que a ficha manda; para demão alta, airless.", why:"Diluição demais dá espessura baixa, poros e crateras.", img:"pistola"},
  {e:"Epóxi ou PU aromático no sol.", c:"No exterior, acabamento de PU alifático sobre o epóxi.", why:"O sol calcina o epóxi e degrada o PU aromático.", img:"mono"},
  {e:"Pintar “no olho”, sem medir espessura.", c:"Medir a espessura úmida durante e a seca depois.", why:"Espessura baixa protege pouco; alta trinca e não cura.", img:"medidor"},
  {e:"Pintar o anodo de sacrifício.", c:"Cobrir os anodos durante a pintura e descobrir depois.", why:"A tinta isola o anodo e ele para de proteger o casco.", img:"anodo"}
];
function abaCerto(){
  return `${p("O jeito certo e o jeito errado, lado a lado. O erro mais comum de pintura não é a tinta: é o preparo.")}
    <div class="cp-ce">${CE.map((x, i) => `<div class="cp-ce-i">${x.img ? fig(x.img, x.e, x.light ? "light" : "") : ""}<div class="cp-ce-r bad">${ic("x")}<span><b>Errado:</b> ${x.e}</span></div><div class="cp-ce-r good">${ic("check")}<span><b>Certo:</b> ${x.c}</span></div><small>${x.why}</small>${x.calc ? `<button type="button" class="btn ghost sm" data-act="cpAba" data-arg="contas|cp-${x.calc}" style="align-self:flex-start">${ic("calc")}Calcular</button>` : ""}</div>`).join("")}</div>`;
}

/* ============================================================ TESTE */
const QZ = [
  ["Quais são os 4 elementos da pilha de corrosão?", ["Ânodo, cátodo, eletrólito e ligação elétrica", "Ferro, oxigênio, sal e sol", "Tinta, primer, solvente e chapa"], 0, "Sem qualquer um dos quatro, a pilha para."],
  ["Onde o metal corrói na pilha?", ["No cátodo", "No ânodo", "No eletrólito"], 1, "O ânodo perde elétrons e se desfaz."],
  ["Parafuso de aço numa peça de bronze, na água do mar. Quem corrói?", ["O bronze", "O parafuso de aço", "Nenhum dos dois"], 1, "O aço é menos nobre que o bronze: vira ânodo."],
  ["Qual forma de corrosão parece pequena por fora mas é funda?", ["Uniforme", "Por pites", "Esfoliação"], 1, "O pite tem profundidade maior que o diâmetro e pode furar a chapa."],
  ["O que é a carepa de laminação?", ["Uma camada de aço mais duro", "Óxido formado na laminação a quente, que se solta com o tempo", "Um tipo de primer de fábrica"], 1, "Carepa não é aço: se pintar por cima, ela leva a tinta junto."],
  ["Qual grau de limpeza é o “metal quase branco”?", ["St 3", "Sa 2", "Sa 2½"], 2, "Sa 2½: 95% da área livre de resíduos."],
  ["O hidrojateamento cria perfil de rugosidade?", ["Sim, mais que o jato abrasivo", "Não, só limpa", "Só com água do mar"], 1, "A água limpa, mas não risca o aço."],
  ["Qual o perfil de rugosidade ideal?", ["O mais alto possível", "De 1/4 a 1/3 da espessura total da tinta", "Zero, chapa lisa"], 1, "Alto demais fura a tinta; baixo demais não ancora."],
  ["Pode pintar se a chapa está só 1 °C acima do ponto de orvalho?", ["Sim", "Não, precisa de pelo menos 3 °C", "Só se for epóxi"], 1, "Abaixo de 3 °C de folga a umidade condensa na chapa."],
  ["Qual camada do esquema é a principal contra a corrosão?", ["Fundo (primer)", "Intermediária", "Acabamento"], 0, "O primer adere à chapa e pode ter inibidor de corrosão."],
  ["Para que serve o tempo de indução da tinta bicomponente?", ["Para a tinta esfriar", "Para as resinas começarem a reagir antes de aplicar", "Para o solvente evaporar todo"], 1, "10 a 15 minutos com a lata fechada."],
  ["Qual PU não pode ir para o sol?", ["Alifático", "Aromático", "Nenhum"], 1, "O aromático é só para interiores."],
  ["Por que a pistola convencional dá mais poros e crateras?", ["Porque a tinta precisa ser mais diluída", "Porque usa pouca tinta", "Porque não usa ar"], 0, "Mais solvente evaporando deixa falhas na película."],
  ["Qual anodo usar em casco de aço na água do mar?", ["Magnésio", "Zinco ou alumínio", "Cobre"], 1, "Magnésio é para água doce."],
  ["Onde se concentra cerca de 1/3 dos anodos de sacrifício?", ["Na proa", "Na popa, perto do hélice", "Na superestrutura"], 1, "A turbulência e o bronze do hélice pedem mais proteção."]
];
function abaTeste(){
  if (!CP.q) return `${p("Quinze perguntas sobre o que está nas abas. Sem nota guardada: é para treinar.")}<button type="button" class="btn primary" data-act="cpQ" data-arg="start">${ic("game")}Começar</button>`;
  if (CP.qi >= CP.q.length) { const n = CP.q.length, pct = CP.ok / n;
    return `<div class="card col" style="align-items:flex-start"><span class="eyebrow">Resultado</span><h2 class="num" style="font-size:34px">${CP.ok} de ${n}</h2><span class="sub">${pct === 1 ? "Gabaritou. Já pode ensinar a divisão." : pct >= .7 ? "Muito bom. Revise as que errou." : "Vale reler as abas Corrosão, Preparo e Pintura."}</span><button type="button" class="btn primary" data-act="cpQ" data-arg="start">${ic("reset")}Fazer de novo</button></div>`; }
  const [q, ops, ok, why] = CP.q[CP.qi], r = CP.resp;
  return `<div class="card col cp-quiz"><span class="sub">Pergunta ${CP.qi + 1} de ${CP.q.length} · ${CP.ok} certas</span><b class="cp-q">${q}</b>
    <div class="col" style="gap:8px">${ops.map((o, i) => `<button type="button" class="cp-op ${r == null ? "" : i === ok ? "ok" : i === r ? "no" : ""}" data-act="cpQ" data-arg="${i}" ${r != null ? "disabled" : ""}>${esc(o)}</button>`).join("")}</div>
    ${r != null ? `${nota((r === ok ? "<b>Certo.</b> " : "<b>Não.</b> ") + why, r === ok ? "good" : "bad")}<button type="button" class="btn primary" data-act="cpQ" data-arg="next" style="align-self:flex-start">${CP.qi + 1 < CP.q.length ? "Próxima" : "Ver resultado"}${ic("chev")}</button>` : ""}</div>`;
}

/* ============================================================ TELA */
const ABAS = [["corrosao", "Corrosão"], ["preparo", "Preparo"], ["pintura", "Pintura"], ["contas", "Contas"], ["catodica", "Proteção catódica"], ["certo", "Certo × errado"], ["teste", "Teste"]];
function viewPintura(){
  const body = {corrosao:abaCorrosao, preparo:abaPreparo, pintura:abaPintura, contas:abaContas, catodica:abaCatodica, certo:abaCerto, teste:abaTeste}[CP.aba] || abaCorrosao;
  return `<div id="cp-root" class="col" style="gap:18px"><button class="back" data-act="marBack">${ic("left")}Marinharia</button>
    <div class="page-h"><span class="eyebrow">Marinharia · Curso CPP</span><h1>Corrosão e pintura</h1><p class="sub" style="font-size:15px">Por que o aço enferruja, como preparar a chapa, como pintar do jeito certo e como o casco é protegido embaixo d'água. Com fotos, contas e um teste no fim.</p></div>
    <div class="seg seg4 cp-abas" role="group" aria-label="Partes do curso">${ABAS.map(([k, n]) => `<button type="button" data-act="cpAba" data-arg="${k}" aria-pressed="${CP.aba === k}">${n}</button>`).join("")}</div>
    ${body()}
    <div class="note">${ic("book")}<span>Baseado no Curso Expedito em Corrosão, Pintura e Proteção Catódica (apostila e slides), que está inteiro nas Apostilas. Para cada tinta valem a ficha técnica do fabricante e o esquema de pintura do navio.</span></div>
    <button type="button" class="btn ghost sm" data-act="apoLer" data-arg="${APO_ID}" data-p="1" style="align-self:flex-start">${ic("book")}Abrir a apostila completa</button></div>`;
}

/* ---------- ações ---------- */
function upd(){
  const f = g$("#cp-form"); if (!f) return;
  const v = Object.assign(CV(), formVals(f)); lsSet(CPV, v);
  [["epu", outEpu], ["rend", outRend], ["orv", outOrv], ["anodo", outAnodo]].forEach(([k, fn]) => { const o = g$("#cp-o-" + k); if (o) o.innerHTML = fn(v); });
}
function shuffle(a){ a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
Object.assign(ACT, {
  cpAbrir(a){ S.gq = ""; S.tab = "mar"; S.mar = "pintura"; const [aba, el] = String(a || "").split("|"); if (aba) CP.aba = aba; render(); scrollTo(0, 0); if (el) setTimeout(() => ACT.jump(el), 60); },
  cpAba(a){ const [aba, el] = String(a || "").split("|"); CP.aba = aba; render(); if (el) setTimeout(() => ACT.jump(el), 60); else { const r = g$(".cp-abas"); if (r) r.scrollIntoView({block:"start"}); } },
  cpMet(a){ const v = Object.assign(CV(), g$("#cp-form") ? formVals(g$("#cp-form")) : {}, {met:a, perda:""}); lsSet(CPV, v); const y = scrollY; render(); scrollTo(0, y); },
  cpAnodo(a){ const v = Object.assign(CV(), g$("#cp-form") ? formVals(g$("#cp-form")) : {}, {c:a}); lsSet(CPV, v); const y = scrollY; render(); scrollTo(0, y); },
  cpZoom(a, el){ openModal(sheetHead(el.dataset.leg || "Figura", "Curso CPP") + `<img class="cp-zoom" src="cpp/${esc(a)}.webp" alt="${esc(el.dataset.leg || "")}">`); },
  cpQ(a){
    if (a === "start") { CP.q = shuffle(QZ); CP.qi = 0; CP.ok = 0; CP.resp = null; }
    else if (a === "next") { CP.qi++; CP.resp = null; }
    else if (CP.resp == null) { CP.resp = +a; if (CP.resp === CP.q[CP.qi][2]) CP.ok++; }
    render(); const r = g$(".cp-quiz") || g$("#cp-root"); if (r) r.scrollIntoView({block:"center"});
  }
});
document.addEventListener("input", ev => { if (ev.target.closest && ev.target.closest("#cp-form")) upd(); });

window.viewPintura = viewPintura;
window.PINTURA_INDEX = () => [
  {tipo:"Marinharia", t:"Corrosão e pintura", sub:"Curso CPP: corrosão, preparo, pintura, proteção catódica", txt:"corrosão corrosao ferrugem pintura industrial curso expedito cpp preparo de superfície tratamento jateamento hidrojateamento proteção catódica anodo pilha", act:"cpAbrir", arg:"corrosao"},
  {tipo:"Corrosão", t:"Formas de corrosão", sub:"Uniforme, placas, alveolar, pites, intergranular, solda", txt:"formas de corrosão uniforme placas alveolar pite pites puntiforme esfoliação intergranular transgranular sob tensão cordão de solda zta filiforme empolamento hidrogênio", act:"cpAbrir", arg:"corrosao|cp-formas"},
  {tipo:"Corrosão", t:"Pilha de corrosão e metais diferentes", sub:"Ânodo, cátodo, eletrólito; pilha galvânica", txt:"pilha ânodo anodo cátodo catodo eletrólito galvânica metais diferentes nobre nobreza aeração diferencial fresta passivação inox", act:"cpAbrir", arg:"corrosao|cp-pilha"},
  {tipo:"Pintura", t:"Graus de limpeza (St 2, St 3, Sa 1, Sa 2, Sa 2½, Sa 3)", sub:"Preparo da superfície e graus de oxidação A, B, C, D", txt:"grau de limpeza st2 st3 sa1 sa2 sa 2 1/2 sa2½ sa3 metal branco quase branco jato comercial brush off iso 8501 grau de oxidação a b c d carepa de laminação", act:"cpAbrir", arg:"preparo|cp-graus"},
  {tipo:"Pintura", t:"Hidrojateamento (WJ-1 a WJ-4) e flash rust", sub:"Pressões, padrões visuais, água", txt:"hidrojateamento hidrojato wj1 wj2 wj3 wj4 flash rust ultra alta pressão uhp", act:"cpAbrir", arg:"preparo|cp-hidro"},
  {tipo:"Pintura", t:"Perfil de rugosidade", sub:"Excessiva, insuficiente e ideal; rugosímetro", txt:"rugosidade perfil de ancoragem rugosímetro disco comparador mils", act:"cpAbrir", arg:"preparo|cp-rug"},
  {tipo:"Ferramentas", t:"Ponto de orvalho: pode pintar?", sub:"Umidade, temperatura do ar e da chapa", txt:"ponto de orvalho umidade relativa temperatura chapa pintar condensação 3 graus 85%", act:"cpAbrir", arg:"contas|cp-orv"},
  {tipo:"Ferramentas", t:"Espessura úmida, rendimento e tinta a comprar", sub:"EPU, rendimento teórico e prático, litros", txt:"espessura úmida seca eps epu sólidos por volume rendimento teórico prático fator de aproveitamento quantidade de tinta litros comprar", act:"cpAbrir", arg:"contas|cp-epu"},
  {tipo:"Pintura", t:"Aplicação: pincel, rolo, pistola e airless", sub:"Vantagens e cuidados de cada um", txt:"pincel trincha rolo pistola convencional airless aplicação demão", act:"cpAbrir", arg:"pintura|cp-aplic"},
  {tipo:"Pintura", t:"Proteção catódica", sub:"Anodo de sacrifício e corrente impressa", txt:"proteção catódica anodo de sacrifício zinco alumínio magnésio corrente impressa retificador anodo inerte bolina hélice", act:"cpAbrir", arg:"catodica"},
  {tipo:"Pintura", t:"Pintura: certo × errado", sub:"Os erros mais comuns de preparo e pintura", txt:"certo errado erros pintura defeito bolha descascar carepa graxa", act:"cpAbrir", arg:"certo"}
];
})();
