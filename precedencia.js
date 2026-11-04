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
  {n:"Almirante", ab:"Alte", c:"Oficial-General", boys:8, t:"s19", fed:4, sal:19, obs:"Posto de tempo de guerra. No Decreto 70.274 aparece como “Almirantes”, na categoria 4, acima dos Almirantes de Esquadra; no bizuário está no grupo do toque de Ministro de Estado."},
  {n:"Almirante de Esquadra", ab:"AE", c:"Oficial-General", boys:8, fed:5, est:4, sal:17, t:"og", cmd:"ogc", cf:"ogcf"},
  {n:"Vice-Almirante", ab:"VA", c:"Oficial-General", boys:8, fed:6, est:5, sal:15, t:"og", cmd:"ogc", cf:"ogcf"},
  {n:"Contra-Almirante", ab:"CA", c:"Oficial-General", boys:6, fed:7, est:6, sal:13, t:"og", cmd:"ogc", cf:"ogcf"},
  {n:"Capitão de Mar e Guerra", ab:"CMG", c:"Oficial Superior", boys:4, fed:8, est:7, t:"os", cmd:"osc", cf:"oscf"},
  {n:"Capitão de Fragata", ab:"CF", c:"Oficial Superior", boys:4, fed:9, est:8, t:"os", cmd:"osc", cf:"oscf"},
  {n:"Capitão de Corveta", ab:"CC", c:"Oficial Superior", boys:4, fed:10, est:9, t:"os", cmd:"osc", cf:"oscf"},
  {n:"Capitão-Tenente", ab:"CT", c:"Oficial Intermediário", boys:2, fed:11, est:10, t:"oi", cmd:"oic"},
  {n:"Primeiro-Tenente", ab:"1ºTen", c:"Oficial Subalterno", boys:2, t:"osub"},
  {n:"Segundo-Tenente", ab:"2ºTen", c:"Oficial Subalterno", boys:2, t:"osub"}
];
const CARGOS = [
  {n:"Comandante da Marinha", t:"cm"},
  {n:"Chefe do Estado-Maior da Armada (CEMA)", t:"cema"},
  {n:"Comandante de Operações Navais (CON)", t:"cema"},
  {n:"Comandante em Chefe da Esquadra (ComemCh)", t:"comemch"}
];

/* ---------- Ordem Geral de Precedência: Decreto nº 70.274/1972 (texto consolidado, Planalto) ----------
   Três listas. Categoria de número menor precede a de número maior; dentro da categoria, a ordem do Decreto.
   Boys pela precedência (Cerimonial, arts. 5-1-8 e 6-1-1): categoria igual ou acima da do Vice-Almirante = 8;
   igual à do Contra-Almirante = 6; igual à de oficial superior (CMG, CF, CC) = 4; igual à do Capitão-Tenente = 2. */
const MB = /^(Almirantes?(-de-Esquadra)?|Vice-Almirantes|Contra-Almirantes|Capitães-de-Mar-e-Guerra|Capitães-de-Fragata|Capitães-de-Corveta|Capitães-Tenentes|Chefe do Estado-Maior da Armada)$/;
const S19 = /^(Vice-Presidente da República|Presidente do Congresso Nacional|Presidente da Câmara dos Deputados|Presidente do Supremo Tribunal Federal|Ministros de Estado|Governador|Governador do Distrito Federal|Governadores dos Estados da União|Governador do Estado da União em que se processa a cerimônia|Governadores dos outros Estados da União e do Distrito Federal|Embaixadores estrangeiros|Almirantes)$/;
const LISTAS = [
  {id:"capital", n:"Federal na Capital", nl:"Cerimônias federais na Capital Federal", va:6, ca:7, sup:[8, 9, 10], int:11, cats:[{"c": 1, "i": ["Presidente da República"]}, {"c": 2, "i": ["Vice-Presidente da República", "Cardeais", "Embaixadores estrangeiros"]}, {"c": 3, "i": ["Presidente do Congresso Nacional", "Presidente da Câmara dos Deputados", "Presidente do Supremo Tribunal Federal"]}, {"c": 4, "i": ["Ministros de Estado", "Chefe do Gabinete Militar da Presidência da República", "Chefe do Gabinete Civil da Presidência da República", "Chefe do Serviço Nacional de Informações", "Chefe do Estado-Maior das Forças Armadas", "Consultor-Geral da República", "Enviados Extraordinários e Ministros Plenipotenciários estrangeiros", "Presidente do Tribunal Superior Eleitoral", "Ministros do Supremo Tribunal Federal", "Procurador-Geral da República", "Governador do Distrito Federal", "Governadores dos Estados da União", "Senadores", "Deputados Federais", "Almirantes", "Marechais", "Marechais-do-Ar", "Chefe do Estado-Maior da Armada", "Chefe do Estado-Maior do Exército", "Secretário-Geral de Política Exterior", "Chefe do Estado-Maior da Aeronáutica"]}, {"c": 5, "i": ["Almirantes-de-Esquadra", "Generais-de-Exército", "Embaixadores Extraordinários e Plenipotenciários (Ministros de 1ª classe)", "Tenentes-Brigadeiros", "Presidente do Tribunal Federal de Recursos", "Presidente do Superior Tribunal Militar", "Presidente do Tribunal Superior do Trabalho", "Presidente do Tribunal de Contas da União", "Ministros do Tribunal Superior Eleitoral", "Encarregados de Negócios estrangeiros"]}, {"c": 6, "i": ["Ministros do Tribunal Federal de Recursos", "Ministros do Superior Tribunal Militar", "Ministros do Tribunal Superior do Trabalho", "Ministros do Tribunal de Contas da União", "Vice-Almirantes", "Generais-de-Divisão", "Embaixadores (Ministros de 1ª classe)", "Majores-Brigadeiros", "Chefes de Igreja sediados no Brasil", "Arcebispos católicos ou equivalentes de outras religiões", "Presidente do Tribunal de Justiça do Distrito Federal e dos Territórios", "Presidente do Tribunal Marítimo", "Diretores-Gerais das Secretarias do Senado Federal e da Câmara dos Deputados", "Procuradores-Gerais da Justiça Militar, Justiça do Trabalho e do Tribunal de Contas da União", "Secretários-Gerais dos Ministérios", "Reitores das Universidades Federais", "Diretor-Geral do Departamento de Polícia Federal", "Presidente do Banco Central do Brasil", "Presidente do Banco do Brasil", "Presidente do Banco Nacional de Desenvolvimento Econômico e Social", "Presidente do Banco Nacional de Habitação", "Secretário da Receita Federal do Brasil", "Juízes do Tribunal Superior do Trabalho", "Subprocuradores-Gerais da República", "Personalidades inscritas no Livro do Mérito", "Prefeitos das cidades de mais de um milhão (1.000.000) de habitantes", "Presidente da Caixa Econômica Federal", "Ministros-Conselheiros estrangeiros", "Adidos Militares estrangeiros (Oficiais-Generais)"]}, {"c": 7, "i": ["Contra-Almirantes", "Generais-de-Brigada", "Embaixadores Comissionados ou Ministros de 2ª classe", "Brigadeiros", "Vice-Governadores dos Estados da União", "Presidentes das Assembleias Legislativas dos Estados da União", "Presidentes dos Tribunais de Justiça dos Estados da União", "Diretor-Geral do Departamento Administrativo do Pessoal Civil", "Chefe do Gabinete da Vice-Presidência da República", "Subchefes dos Gabinetes Militar e Civil da Presidência da República", "Assessor-Chefe da Assessoria Especial da Presidência da República", "Assessor-Chefe da Assessoria Especial de Relações Públicas da Presidência da República", "Assistente-Secretário do Chefe do Gabinete Militar da Presidência da República", "Secretários Particulares do Presidente da República", "Chefe do Cerimonial da Presidência da República", "Secretários de Imprensa da Presidência da República", "Diretor-Geral da Agência Nacional", "Presidente da Central de Medicamentos", "Chefe do Gabinete da Secretaria-Geral do Conselho de Segurança Nacional", "Chefe do Gabinete do Serviço Nacional de Informações", "Chefe do Gabinete do Estado-Maior das Forças Armadas", "Chefe da Agência Central do Serviço Nacional de Informações", "Chefes dos Gabinetes dos Ministros de Estado", "Presidente do Conselho Nacional de Pesquisas", "Presidente do Conselho Federal de Educação", "Presidente do Conselho Federal de Cultura", "Governadores dos Territórios", "Chanceler da Ordem Nacional do Mérito", "Presidente da Academia Brasileira de Letras", "Presidente da Academia Brasileira de Ciências", "Presidente da Associação Brasileira de Imprensa", "Diretores do Gabinete Civil da Presidência da República", "Diretores-Gerais de Departamento dos Ministérios", "Superintendentes de Órgãos Federais", "Presidentes dos Institutos e Fundações Nacionais", "Presidentes dos Conselhos e Comissões Federais", "Presidentes das Entidades Autárquicas, Sociedades de Economia Mista e Empresas Públicas de âmbito nacional", "Presidentes dos Tribunais Regionais Eleitorais", "Presidentes dos Tribunais Regionais do Trabalho", "Presidentes dos Tribunais de Contas do Distrito Federal e dos Estados da União", "Presidentes dos Tribunais de Alçada dos Estados da União", "Reitores das Universidades Estaduais e Particulares", "Membros do Conselho Nacional de Pesquisas", "Membros do Conselho Nacional de Educação", "Membros do Conselho Federal de Cultura", "Secretários de Estado do Governo do Distrito Federal", "Bispos católicos ou equivalentes de outras religiões", "Conselheiros estrangeiros", "Cônsules-Gerais estrangeiros", "Adidos e Adjuntos Militares estrangeiros (Capitães-de-Mar-e-Guerra e Coronéis)"]}, {"c": 8, "i": ["Presidentes das Confederações Patronais e de Trabalhadores de âmbito nacional", "Consultores Jurídicos dos Ministérios", "Membros da Academia Brasileira de Letras", "Membros da Academia Brasileira de Ciências", "Diretores do Banco Central do Brasil", "Diretores do Banco do Brasil", "Diretores do Banco Nacional de Desenvolvimento Econômico", "Diretores do Banco Nacional de Habitação", "Capitães-de-Mar-e-Guerra", "Coronéis do Exército", "Conselheiros", "Coronéis da Aeronáutica", "Secretários de Estado dos Governos dos Estados da União", "Deputados Estaduais", "Chefes das Casas Militares de Governadores", "Chefes das Casas Civis de Governadores", "Comandantes das Polícias Militares", "Desembargadores dos Tribunais de Justiça do Distrito Federal e dos Estados da União", "Adjuntos dos Gabinetes Militar (Tenentes-Coronéis) e Civil da Presidência da República", "Procuradores-Gerais do Distrito Federal e dos Estados da União", "Prefeitos das Capitais dos Estados da União e das cidades de mais de quinhentos mil (500.000) habitantes", "Primeiros Secretários estrangeiros", "Procuradores da República nos Estados da União", "Consultores-Gerais do Distrito Federal e dos Estados da União", "Juízes do Tribunal Marítimo", "Juízes dos Tribunais Regionais Eleitorais", "Juízes dos Tribunais Regionais do Trabalho", "Presidentes das Câmaras Municipais das cidades de mais de um milhão (1.000.000) de habitantes", "Adidos e Adjuntos Militares estrangeiros (Capitães-de-Fragata e Tenentes-Coronéis)"]}, {"c": 9, "i": ["Juízes dos Tribunais de Contas do Distrito Federal e dos Estados da União", "Juízes dos Tribunais de Alçada dos Estados da União", "Delegados dos Ministérios nos Estados da União", "Presidentes dos Institutos e Fundações Regionais e Estaduais", "Presidentes das Entidades Autárquicas, Sociedades de Economia Mista e Empresas Públicas de âmbito regional ou estadual", "Monsenhores católicos ou equivalentes de outras religiões", "Capitães-de-Fragata", "Tenentes-Coronéis do Exército", "Primeiros Secretários", "Tenentes-Coronéis da Aeronáutica", "Ajudantes-de-Ordens do Presidente da República (Majores)", "Adjuntos do Gabinete Militar da Presidência da República (Majores)", "Chefes dos Serviços do Gabinete Militar da Presidência da República (Majores)", "Adjuntos dos Serviços do Gabinete Militar da Presidência da República (Majores)", "Presidentes das Federações Patronais e de Trabalhadores de âmbito regional ou estadual", "Presidentes das Câmaras Municipais das Capitais dos Estados da União e das cidades de mais de quinhentos mil (500.000) habitantes", "Juízes de Direito", "Procuradores Regionais do Trabalho", "Diretores de Repartições Federais", "Auditores da Justiça Militar", "Auditores do Tribunal de Contas", "Promotores Públicos", "Procuradores-Adjuntos da República", "Diretores das Faculdades Estaduais e Particulares", "Segundos Secretários", "Cônsules estrangeiros", "Adidos e Adjuntos Militares estrangeiros (Capitães-de-Corveta e Majores)"]}, {"c": 10, "i": ["Oficiais de Gabinete do Gabinete Civil da Presidência da República", "Chefes de Departamento das Universidades Federais", "Diretores de Divisão dos Ministérios", "Prefeitos das cidades de mais de cem mil (100.000) habitantes", "Capitães-de-Corveta", "Majores do Exército", "Segundos Secretários", "Majores da Aeronáutica", "Ajudantes-de-Ordens do Presidente da República (Capitães)", "Adjuntos dos Serviços do Gabinete Militar da Presidência da República (Capitães)", "Secretários-Gerais dos Territórios", "Diretores de Departamento das Secretarias do Distrito Federal e dos Estados da União", "Presidentes dos Conselhos Estaduais", "Chefes de Departamento das Universidades Estaduais e Particulares", "Presidentes das Câmaras Municipais das cidades de mais de cem mil (100.000) habitantes", "Terceiros Secretários estrangeiros", "Adidos e Adjuntos Militares estrangeiros (Capitães-Tenentes e Capitães)"]}, {"c": 11, "i": ["Professores de Universidade", "Prefeitos Municipais", "Cônegos católicos ou equivalentes de outras religiões", "Capitães-Tenentes", "Capitães do Exército", "Terceiros Secretários", "Capitães da Aeronáutica", "Presidentes das Câmaras Municipais", "Diretores de Repartições do Distrito Federal, dos Estados da União e Territórios", "Diretores de Escolas de Ensino Secundário", "Vereadores Municipais"]}]},
  {id:"estados", n:"Federal nos Estados", nl:"Cerimônias federais nos Estados, com autoridades federais", va:6, ca:7, sup:[8, 9, 10], int:11, cats:[{"c": 1, "i": ["Presidente da República"]}, {"c": 2, "i": ["Vice-Presidente da República", "Governador do Estado da União em que se processa a cerimônia", "Cardeais", "Embaixadores estrangeiros"]}, {"c": 3, "i": ["Presidente do Congresso Nacional", "Presidente da Câmara dos Deputados", "Presidente do Supremo Tribunal Federal"]}, {"c": 4, "i": ["Ministros de Estado", "Chefe do Gabinete Militar da Presidência da República", "Chefe do Gabinete Civil da Presidência da República", "Chefe do Serviço Nacional de Informações", "Chefe do Estado-Maior das Forças Armadas", "Consultor-Geral da República", "Vice-Governador do Estado da União em que se processa a cerimônia", "Presidente da Assembleia Legislativa do Estado da União em que se processa a cerimônia", "Presidente do Tribunal de Justiça do Estado em que se processa a cerimônia", "Enviados Extraordinários e Ministros Plenipotenciários estrangeiros", "Presidente do Tribunal Superior Eleitoral", "Ministros do Supremo Tribunal Federal", "Procurador-Geral da República", "Governadores dos outros Estados da União e do Distrito Federal", "Senadores", "Deputados Federais", "Almirantes", "Marechais", "Marechais-do-Ar", "Chefe do Estado-Maior da Armada", "Chefe do Estado-Maior do Exército", "Secretário-Geral da Política Exterior", "Chefe do Estado-Maior da Aeronáutica"]}, {"c": 5, "i": ["Almirantes-de-Esquadra", "Generais-de-Exército", "Embaixadores Extraordinários e Plenipotenciários (Ministros de 1ª classe)", "Tenentes-Brigadeiros", "Presidente do Tribunal Federal de Recursos", "Presidente do Superior Tribunal Militar", "Presidente do Tribunal Superior do Trabalho", "Presidente do Tribunal de Contas da União", "Ministros do Tribunal Superior Eleitoral", "Prefeito da Capital estadual em que se processa a cerimônia", "Encarregados de Negócios estrangeiros"]}, {"c": 6, "i": ["Ministros do Tribunal Federal de Recursos", "Ministros do Superior Tribunal Militar", "Ministros do Tribunal Superior do Trabalho", "Ministros do Tribunal de Contas da União", "Vice-Almirantes", "Generais-de-Divisão", "Embaixadores (Ministros de 1ª classe)", "Majores-Brigadeiros", "Chefes de Igreja sediados no Brasil", "Arcebispos católicos ou equivalentes de outras religiões", "Presidente do Tribunal Marítimo", "Diretores-Gerais das Secretarias do Senado Federal e da Câmara dos Deputados", "Substitutos eventuais dos Ministros de Estado", "Secretários-Gerais dos Ministérios", "Reitores das Universidades Federais", "Diretor-Geral do Departamento de Polícia Federal", "Presidente do Banco Central do Brasil", "Presidente do Banco do Brasil", "Presidente do Banco Nacional de Desenvolvimento Econômico e Social", "Juízes do Tribunal Superior do Trabalho", "Subprocuradores-Gerais da República", "Procuradores-Gerais da Justiça Militar", "Procuradores-Gerais da Justiça do Trabalho", "Procuradores-Gerais do Tribunal de Contas da União", "Vice-Governadores de outros Estados da União", "Secretário da Receita Federal", "Personalidades inscritas no Livro do Mérito", "Prefeito da cidade em que se processa a cerimônia", "Presidente da Câmara Municipal da cidade em que se processa a cerimônia", "Juiz de Direito da Comarca em que se processa a cerimônia", "Prefeitos das cidades de mais de um milhão (1.000.000) de habitantes", "Presidente da Caixa Econômica Federal", "Ministros-Conselheiros estrangeiros", "Cônsules-Gerais estrangeiros", "Adidos Militares estrangeiros (Oficiais-Generais)"]}, {"c": 7, "i": ["Contra-Almirantes", "Generais-de-Brigada", "Embaixadores Comissionados ou Ministros de 2ª classe", "Brigadeiros-do-Ar", "Diretor-Geral do Departamento Administrativo do Pessoal Civil", "Chefe do Gabinete da Vice-Presidência da República", "Subchefes dos Gabinetes Militar e Civil da Presidência da República", "Assessor-Chefe da Assessoria Especial da Presidência da República", "Assessor-Chefe da Assessoria Especial de Relações Públicas da Presidência da República", "Assistente-Secretário do Chefe do Gabinete Militar da Presidência da República", "Secretários Particulares do Presidente da República", "Chefe do Cerimonial da Presidência da República", "Secretários de Imprensa da Presidência da República", "Diretor-Geral da Agência Nacional", "Presidente da Central de Medicamentos", "Chefe do Gabinete da Secretaria-Geral do Conselho de Segurança Nacional", "Chefe do Gabinete do Serviço Nacional de Informações", "Chefe do Gabinete do Estado-Maior das Forças Armadas", "Chefe da Agência Central do Serviço Nacional de Informações", "Presidente do Tribunal Regional Eleitoral", "Governadores dos Territórios", "Procurador da República no Estado", "Procurador-Geral do Estado", "Presidente do Tribunal Regional do Trabalho", "Presidente do Tribunal de Contas do Estado", "Presidente do Tribunal de Alçada do Estado", "Presidente do Conselho Nacional de Pesquisas", "Presidente do Conselho Federal de Educação", "Presidente do Conselho Federal de Cultura", "Chanceler da Ordem Nacional do Mérito", "Presidente da Academia Brasileira de Letras", "Presidente da Academia Brasileira de Ciências", "Presidente da Associação Brasileira de Imprensa", "Diretores do Gabinete Civil da Presidência da República", "Diretores-Gerais dos Departamentos de Ministérios", "Superintendentes de órgãos Federais", "Presidentes dos Institutos e Fundações Nacionais", "Presidentes dos Conselhos e Comissões Federais", "Presidentes das Entidades Autárquicas, Sociedades de Economia Mista e Empresas Públicas de âmbito nacional", "Chefes dos Gabinetes dos Ministros de Estado", "Reitores das Universidades Estaduais e Particulares", "Membros do Conselho Nacional de Pesquisas", "Membros do Conselho Federal de Educação", "Membros do Conselho Federal de Cultura", "Secretários do Governo do Estado em que se processa a cerimônia", "Bispos católicos ou equivalentes de outras religiões", "Conselheiros estrangeiros", "Adidos e Adjuntos Militares estrangeiros (Capitães-de-Mar-e-Guerra e Coronéis)"]}, {"c": 8, "i": ["Presidentes das Confederações Patronais e de Trabalhadores de âmbito nacional", "Consultores Jurídicos dos Ministérios", "Membros da Academia Brasileira de Letras", "Membros da Academia Brasileira de Ciências", "Diretores do Banco Central do Brasil", "Diretores do Banco do Brasil", "Diretores do Banco Nacional de Desenvolvimento Econômico", "Diretores do Banco Nacional de Habitação", "Capitães-de-Mar-e-Guerra", "Coronéis do Exército", "Conselheiros", "Coronéis da Aeronáutica", "Deputados do Estado em que se processa a cerimônia", "Chefe da Casa Militar do Governo do Estado em que se processa a cerimônia", "Chefe da Casa Civil do Governo do Estado em que se processa a cerimônia", "Comandante da Polícia Militar do Estado em que se processa a cerimônia", "Desembargadores do Tribunal de Justiça do Estado em que se processa a cerimônia", "Adjuntos dos Gabinetes Militar e Civil da Presidência da República", "Prefeitos das cidades de mais de quinhentos mil (500.000) habitantes", "Delegados dos Ministérios no Estado em que se processa a cerimônia", "Primeiros Secretários estrangeiros", "Cônsules estrangeiros", "Consultor-Geral do Estado em que se processa a cerimônia", "Juízes do Tribunal Marítimo", "Juízes do Tribunal Regional Eleitoral do Estado em que se processa a cerimônia", "Juízes do Tribunal Regional do Trabalho do Estado em que se processa a cerimônia", "Presidentes das Câmaras Municipais da Capital e das cidades de mais de um milhão (1.000.000) de habitantes", "Adidos e Adjuntos Militares estrangeiros (Capitães-de-Fragata e Tenentes-Coronéis)"]}, {"c": 9, "i": ["Juiz Federal", "Juízes do Tribunal de Contas do Estado em que se processa a cerimônia", "Juízes do Tribunal de Alçada do Estado em que se processa a cerimônia", "Presidentes dos Institutos e Fundações Regionais e Estaduais", "Presidentes das Entidades Autárquicas, Sociedades de Economia Mista e Empresas Públicas de âmbito regional ou estadual", "Diretores das Faculdades Federais", "Monsenhores católicos ou equivalentes de outras religiões", "Capitães-de-Fragata", "Tenentes-Coronéis do Exército", "Primeiros-Secretários", "Tenentes-Coronéis da Aeronáutica", "Ajudantes-de-Ordens do Presidente da República (Majores)", "Adjuntos do Gabinete Militar da Presidência da República (Majores)", "Chefes dos Serviços do Gabinete Militar da Presidência da República (Majores)", "Adjuntos dos Serviços do Gabinete Militar da Presidência da República (Majores)", "Presidentes das Federações Patronais e de Trabalhadores de âmbito regional ou estadual", "Presidentes das Câmaras Municipais das Capitais dos Estados da União e das cidades de mais de quinhentos mil (500.000) habitantes", "Juízes de Direito", "Procuradores Regionais do Trabalho", "Diretores de Repartições Federais", "Auditores da Justiça Militar", "Auditores do Tribunal de Contas", "Promotores Públicos", "Procuradores-Adjuntos da República", "Diretores das Faculdades Estaduais e Particulares", "Segundos Secretários estrangeiros", "Vice-Cônsules estrangeiros", "Adidos e Adjuntos Militares estrangeiros (Capitães-de-Corveta e Majores)"]}, {"c": 10, "i": ["Oficiais de Gabinete do Gabinete Civil da Presidência da República", "Chefes de Departamento das Universidades Federais", "Diretores de Divisão dos Ministérios", "Prefeitos das cidades de mais de cem mil (100.000) habitantes", "Capitães-de-Corveta", "Majores", "Segundos Secretários", "Majores da Aeronáutica", "Ajudantes-de-Ordens do Presidente da República (Capitães)", "Adjuntos dos Serviços do Gabinete Militar da Presidência da República (Capitães)", "Secretários-Gerais dos Territórios", "Diretores de Departamento das Secretarias do Estado em que se processa a cerimônia", "Presidentes dos Conselhos Estaduais", "Chefes de Departamento das Universidades Estaduais e Particulares", "Presidentes das Câmaras Municipais das cidades de mais de cem mil (100.000) habitantes", "Terceiros Secretários estrangeiros", "Adidos e Adjuntos Militares estrangeiros (Capitães-Tenentes e Capitães)"]}, {"c": 11, "i": ["Professores de Universidade", "Demais Prefeitos Municipais", "Cônegos católicos ou equivalentes de outras religiões", "Capitães-Tenentes", "Capitães do Exército", "Terceiros Secretários", "Capitães da Aeronáutica", "Presidentes das demais Câmaras Municipais", "Diretores de Repartições dos Estados da União em que se processa a cerimônia", "Diretores de Escolas de Ensino Secundário", "Vereadores Municipais"]}]},
  {id:"estadual", n:"Estadual", nl:"Cerimônias oficiais de caráter estadual", va:5, ca:6, sup:[7, 8, 9], int:10, ae:4, cats:[{"c": 1, "i": ["Governador", "Cardeais"]}, {"c": 2, "i": ["Vice-Governador"]}, {"c": 3, "i": ["Presidente da Assembleia Legislativa", "Presidente do Tribunal de Justiça"]}, {"c": 4, "i": ["Almirante-de-Esquadra", "Generais-de-Exército", "Tenentes-Brigadeiros", "Prefeito da Capital estadual em que se processa a cerimônia"]}, {"c": 5, "i": ["Vice-Almirantes", "Generais-de-Divisão", "Majores-Brigadeiros", "Chefes de Igreja sediados no Brasil", "Arcebispos católicos ou equivalentes de outras religiões", "Reitores das Universidades Federais", "Personalidades inscritas no Livro do Mérito", "Prefeito da cidade em que se processa a cerimônia", "Presidente da Câmara Municipal da cidade em que se processa a cerimônia", "Juiz de Direito da Comarca em que se processa a cerimônia", "Prefeitos das cidades de mais de um milhão (1.000.000) de habitantes"]}, {"c": 6, "i": ["Contra-Almirantes", "Generais-de-Brigada", "Brigadeiros-do-Ar", "Presidente do Tribunal Regional Eleitoral", "Procurador Regional da República no Estado", "Procurador-Geral do Estado", "Presidente do Tribunal Regional do Trabalho", "Presidente do Tribunal de Contas", "Presidente do Tribunal de Alçada", "Chefe da Agência do Serviço Nacional de Informações", "Superintendentes de Órgãos Federais", "Presidentes dos Institutos e Fundações Nacionais", "Presidentes dos Conselhos e Comissões Federais", "Presidentes das Entidades Autárquicas, Sociedades de Economia Mista e Empresas Públicas de âmbito nacional", "Reitores das Universidades Estaduais e Particulares", "Membros do Conselho Nacional de Pesquisas", "Membros do Conselho Federal de Educação", "Membros do Conselho Federal de Cultura", "Secretários de Estado", "Bispos católicos ou equivalentes de outras religiões"]}, {"c": 7, "i": ["Presidentes das Confederações Patronais e de Trabalhadores de âmbito nacional", "Membros da Academia Brasileira de Letras", "Membros da Academia Brasileira de Ciências", "Diretores do Banco Central do Brasil", "Diretores do Banco do Brasil", "Diretores do Banco Nacional de Desenvolvimento Econômico", "Diretores do Banco Nacional de Habitação", "Capitães-de-Mar-e-Guerra", "Coronéis do Exército", "Coronéis da Aeronáutica", "Deputados Estaduais", "Chefe da Casa Militar do Governador", "Chefe da Casa Civil do Governador", "Comandante da Polícia Militar do Estado", "Desembargadores do Tribunal de Justiça", "Prefeitos das cidades de mais de quinhentos mil (500.000) habitantes", "Delegados dos Ministérios", "Cônsules estrangeiros", "Consultor-Geral do Estado", "Juízes do Tribunal Regional Eleitoral", "Juízes do Tribunal Regional do Trabalho", "Presidentes das Câmaras Municipais da Capital e das cidades de mais de um milhão (1.000.000) habitantes"]}, {"c": 8, "i": ["Juiz Federal", "Juízes do Tribunal de Contas", "Juízes do Tribunal de Alçada", "Presidentes dos Institutos e Fundações Regionais e Estaduais", "Presidentes das Entidades Autárquicas, Sociedades de Economia Mista e Empresas Públicas de âmbito regional ou estadual", "Diretores das Faculdades Federais", "Monsenhores católicos ou equivalentes de outras religiões", "Capitães-de-Fragata", "Tenentes-Coronéis do Exército", "Tenentes-Coronéis da Aeronáutica", "Presidentes das Federações Patronais e de Trabalhadores de âmbito regional ou estadual", "Presidentes das Câmaras Municipais das cidades de mais de quinhentos mil (500.000) habitantes", "Juízes de Direito", "Procurador Regional do Trabalho", "Auditores da Justiça Militar", "Auditores do Tribunal de Contas", "Promotores Públicos", "Diretores das Faculdades Estaduais e Particulares", "Vice-Cônsules estrangeiros"]}, {"c": 9, "i": ["Chefes de Departamento das Universidades Federais", "Prefeitos das cidades de mais de cem mil (100.000) habitantes", "Capitães-de-Corveta", "Majores do Exército", "Majores da Aeronáutica", "Diretores de Departamento das Secretarias", "Presidentes dos Conselhos Estaduais", "Chefes de Departamento das Universidades Estaduais e Particulares", "Presidentes das Câmaras Municipais das cidades de mais de cem mil (100.000) habitantes"]}, {"c": 10, "i": ["Professores de Universidade", "Demais Prefeitos Municipais", "Cônegos católicos ou equivalentes de outras religiões", "Capitães-Tenentes", "Capitães do Exército", "Capitães da Aeronáutica", "Presidentes das demais Câmaras Municipais", "Diretores de Repartição", "Diretores de Escolas de Ensino Secundário", "Vereadores Municipais"]}]}
];
const LS = id => LISTAS.find(l => l.id === id) || LISTAS[0];
/* Boys e toque de cada categoria, pela posição em relação aos postos da Marinha na mesma lista. */
function catInfo(L, c){
  const ae = L.ae || 5;
  if (c <= L.va) return {boys:8, tq:c === 1 && L.id !== "estadual" ? ["pr"] : c < ae ? ["s19", "og"] : ["og"], eq:c < ae ? "acima do Almirante de Esquadra" : c === ae ? "Almirante de Esquadra" : c === L.va ? "Vice-Almirante" : "entre AE e VA"};
  if (c === L.ca) return {boys:6, tq:["og"], eq:"Contra-Almirante"};
  const k = L.sup.indexOf(c); if (k >= 0) return {boys:4, tq:["os"], eq:["Capitão de Mar e Guerra", "Capitão de Fragata", "Capitão de Corveta"][k]};
  return {boys:2, tq:["oi"], eq:"Capitão-Tenente"};
}

const PR = {aba:"postos", q:"", play:null, lista:"capital", open:null};
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
      ${p.fed || p.sal ? `<div class="pr-meta">${p.fed ? `<span class="pill">Decreto 70.274: cat. ${p.fed} federal${p.est ? ` · ${p.est} estadual` : ""}</span>` : ""}${p.sal ? `<span class="pill">Salva de ${p.sal} tiros</span>` : ""}</div>` : `<div class="pr-meta"><span class="pill">Tenentes não constam do Decreto 70.274</span></div>`}
      ${p.obs ? `<p class="sub" style="margin:0;font-size:13px">${esc(p.obs)}</p>` : ""}
    </div>`;
  }).join("");
  return `<div class="chips pr-resumo">${[["8", "AE e VA"], ["6", "CA"], ["4", "Of. Superior"], ["2", "Intermediário e Subalterno"]].map(([n, q]) => `<div class="chip-v"><small>${q}</small><span>${n} boys</span></div>`).join("")}</div>
    <div class="note good">${ic("users")}<span><b>Autoridade civil ou de outra Força:</b> conte os boys pela precedência dela no Decreto 70.274. <b>Igual ou superior à do Vice-Almirante: 8 boys.</b> <b>Igual à do Contra-Almirante: 6 boys.</b> Igual à de oficial superior: 4. Igual à do Capitão-Tenente: 2 (arts. 5-1-8 e 6-1-1). A aba Autoridades já mostra o número em cada categoria. <button type="button" class="btn sm" data-act="prAba" data-arg="aut" style="margin-top:8px">Ver autoridades</button></span></div>
    <div class="note">${ic("info")}<span>Os <b>boys</b> formam duas filas no portaló, uma de cada lado, e a autoridade passa entre elas. O número vale para recepção e despedida em visita oficial ou anunciada (art. 5-1-8). Se o convés não comportar, quem recebe pode mandar pôr <b>dois boys</b> junto ao patim inferior da escada (ou da prancha) ou <b>reduzir</b> a quantidade, sempre em <b>número par</b> (art. 5-1-9).</span></div>
    <div class="sec-title"><h2>Cargos com toque próprio</h2></div>
    <div class="col" style="gap:8px">${CARGOS.map(c => `<div class="card pr-cargo"><div style="flex:1;min-width:0"><b>${esc(c.n)}</b><div>${tqLink(c.t, "8 boys ·")}</div></div>${playBtn(c.t, " ")}</div>`).join("")}</div>
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

function catCard(L, cat, its, q){
  const ci = catInfo(L, cat.c), mbs = cat.i.filter(t => MB.test(t) && /Almirante|Capitã/.test(t));
  const id = L.id + "-" + cat.c, tq = ci.tq.map(TQ);
  return `<details class="sec pr-grp" id="pr-g-${id}" ${q || PR.open === id ? "open" : ""}>
    <summary><span class="sec-n">${cat.c}</span><b>Categoria ${cat.c}<span class="sub" style="display:block;font-family:var(--f-body);font-weight:500;font-size:12.5px">${mbs.length ? esc(mbs.join(", ")) + " · " : ""}${cat.i.length} ${cat.i.length === 1 ? "autoridade" : "autoridades"}</span></b><span class="pr-nb sm"><span class="num">${ci.boys}</span><small>boys</small></span>${ic("down")}</summary>
    <div class="sec-body">
      <div class="pr-meta"><span class="pill accent">${ci.boys} boys</span><span class="pill">Precedência de ${esc(ci.eq)}</span></div>
      ${tq.map((t, k) => `<div class="pr-tql"><small>${tq.length > 1 ? (k ? "Os demais da categoria" : "Quem tem salva de 19 tiros (marcados)") : "Toque"}</small><button type="button" class="pr-lnk" data-act="prVerToque" data-arg="${t.id}">${esc(t.n)} <span class="num">${t.tr} · ${t.x}×</span></button>${playBtn(t.id, " ")}</div>`).join("")}
      <ol class="pr-list">${its.map(x => { const mb = MB.test(x.t), s19 = tq.length > 1 && S19.test(x.t); return `<li value="${x.i + 1}"${mb ? ` class="mb"` : ""}>${esc(x.t)}${mb ? ` <span class="pill accent">MB</span>` : ""}${s19 ? ` <span class="pill">19 tiros</span>` : ""}</li>`; }).join("")}</ol>
    </div></details>`;
}
function autRes(){
  const q = norm(PR.q).trim(), L = LS(PR.lista);
  const out = L.cats.map(cat => {
    const its = cat.i.map((t, i) => ({t, i})).filter(x => !q || norm(x.t).includes(q));
    return q && !its.length ? "" : catCard(L, cat, its, q);
  }).join("");
  if (out) return out;
  const outras = LISTAS.filter(o => o !== L && o.cats.some(c => c.i.some(t => norm(t).includes(q))));
  return `<div class="empty">Nada nesta lista para “${esc(PR.q)}”.${outras.length ? ` Aparece em: ${outras.map(o => `<button type="button" class="pr-lnk" data-act="prLista" data-arg="${o.id}">${esc(o.n)}</button>`).join(", ")}.` : ""}</div>`;
}
function viewAut(){
  const L = LS(PR.lista);
  const regua = [["8", `Cat. 1 a ${L.va}`, "igual ou acima do VA"], ["6", `Cat. ${L.ca}`, "igual ao CA"], ["4", `Cat. ${L.sup[0]} a ${L.sup[2]}`, "CMG, CF e CC"], ["2", `Cat. ${L.int}`, "igual ao CT"]];
  return `<div class="seg pr-listas" role="group" aria-label="Tipo de cerimônia">${LISTAS.map(o => `<button type="button" data-act="prLista" data-arg="${o.id}" aria-pressed="${o === L}">${esc(o.n)}</button>`).join("")}</div>
    <p class="sub" style="font-size:14.5px;margin:0"><b>${esc(L.nl)}.</b> Ordem Geral de Precedência do <b>Decreto nº 70.274/1972</b>. Categoria de número menor vem antes; dentro da categoria vale a ordem do Decreto. Primeiro veja qual das três listas vale para a cerimônia.</p>
    <div class="card col" style="gap:10px"><div class="rl-h">Boys pela precedência</div>
      <div class="pr-regua">${regua.map(([n, c, d]) => `<div class="chip-v"><small>${c}</small><span>${n} boys</span><small>${d}</small></div>`).join("")}</div>
      <p class="sub" style="margin:0;font-size:13.5px">Autoridade civil ou de outra Força recebe as honras da autoridade naval de mesma precedência, exceto salva; acima do Almirante de Esquadra, as honras dele (Cerimonial, art. 6-1-1). Na honra de portaló, a autoridade civil é anunciada pelo cargo.</p></div>
    <div class="gsearch" style="max-width:none">${ic("search")}<input id="pr-q" type="search" placeholder="Procure o cargo: prefeito, juiz, bispo…" autocomplete="off" value="${esc(PR.q)}" aria-label="Procurar autoridade"></div>
    <div id="pr-aut" class="col" style="gap:10px">${autRes()}</div>
    <div class="card col" style="gap:8px"><div class="rl-h">Regras do Decreto que mudam a ordem</div>
      <ul class="ul" style="font-size:14px">
        <li><b>Art. 11:</b> em cerimônia federal, na mesma categoria, vêm primeiro os estrangeiros, depois as autoridades da União, depois as estaduais e municipais.</li>
        <li><b>Art. 12:</b> diplomata ou militar da ativa em função administrativa usa a precedência que mais o beneficiar.</li>
        <li><b>Embaixadores (Ministros de 1ª classe):</b> com diplomatas estrangeiros presentes, precedem Almirantes de Esquadra e Generais de Exército.</li>
        <li><b>Art. 16:</b> casos omissos e autoridades fora da lista: decide o Chefe do Cerimonial.</li>
        <li>Em cerimônia exclusivamente militar vale o cerimonial militar. O Decreto mantém nomes de cargos antigos, como estão no texto consolidado.</li>
      </ul></div>`;
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
    <div class="page-h"><span class="eyebrow">Marinharia · Cerimonial</span><h1>Ordem de precedência</h1><p class="sub" style="font-size:15px">Do Almirante ao Segundo-Tenente: o toque de apito de cada um, quantos boys formam no portaló e a Ordem Geral de Precedência do Decreto 70.274, com os boys de cada autoridade. Funciona sem internet.</p></div>
    <div class="seg seg4 pr-abas" role="group" aria-label="Seções">${abas.map(([k, n]) => `<button type="button" data-act="prAba" data-arg="${k}" aria-pressed="${PR.aba === k}">${n}</button>`).join("")}</div>
    <div id="pr-root" class="col" style="gap:14px">${body}</div>
    <div class="card col pr-ref" style="gap:6px"><div class="rl-h">Referências</div>
      <p class="sub" style="margin:0;font-size:13px">BRASIL. <b>Decreto nº 70.274, de 9 de março de 1972.</b> Aprova as normas do cerimonial público e a ordem geral de precedência. Texto consolidado, Portal da Legislação da Presidência da República. <a href="https://www.planalto.gov.br/ccivil_03/decreto/d70274.htm" target="_blank" rel="noopener">planalto.gov.br/ccivil_03/decreto/d70274.htm</a></p>
      <p class="sub" style="margin:0;font-size:13px">MARINHA DO BRASIL. <b>Cerimonial da Marinha</b> (Portaria nº 368/MB/2016), arts. 1-3-5, 3-2-6 (salvas), 5-1-3 a 5-1-9 (toques e boys), 5-3-4, 6-1-1 e 6-1-7.</p>
      <p class="sub" style="margin:0;font-size:13px">Bizuário de Cerimonial e Ordem de Precedência e Cartão de Toques de Apito.</p></div>`;
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
  prLista(a){ PR.lista = a; PR.open = null; render(); },
  prPlay(a){ if (PR.play === a) stopPlay(); else play(a); },
  prVerToque(a){ stopPlay(); PR.aba = "toques"; render(); setTimeout(() => { const el = g$("#pr-t-" + a); if (el) { el.scrollIntoView({behavior:"smooth", block:"center"}); el.classList.add("flash"); setTimeout(() => el.classList.remove("flash"), 1400); } }, 40); },
  prAbrir(a){ stopPlay(); S.gq = ""; S.tab = "mar"; S.mar = "precedencia"; const [aba, x] = String(a || "").split("|"); PR.aba = aba || "postos"; if (aba === "aut" && x) { PR.lista = x.split("-")[0]; PR.open = x; } else PR.open = x || null; PR.q = ""; render(); scrollTo(0, 0);
    if (x) setTimeout(() => { const el = g$("#pr-g-" + x) || g$("#pr-t-" + x); if (el) el.scrollIntoView({block:"start"}); }, 40); }
});
document.addEventListener("input", ev => { if (ev.target.id === "pr-q") { PR.q = ev.target.value; const r = g$("#pr-aut"); if (r) r.innerHTML = autRes(); } });
/* Saiu da tela: para o som. */
new MutationObserver(() => { if (PR.play && !g$("#pr-root")) stopPlay(); }).observe(document.getElementById("view") || document.body, {childList:true});

window.viewPrecedencia = viewPrecedencia;
window.PRECEDENCIA_INDEX = () => [
  {tipo:"Marinharia", t:"Ordem de precedência", sub:"Postos, toques de apito e número de boys", txt:"ordem de precedência precedencia antiguidade posto postos boy boys portaló portalo honras toque toques apito trinado cerimonial almirante vice contra capitão de mar e guerra fragata corveta tenente oficial general superior intermediário subalterno comandante imediato", act:"prAbrir", arg:"postos"},
  ...TOQUES.concat(EXTRA).map(t => ({tipo:"Toque de apito", t:"Toque: " + t.n, sub:(t.tr ? t.tr + " · " : "") + t.x + "× o toque" + (t.boys != null ? " · " + boysTxt(t.boys) : ""), txt:t.n + " " + (t.sub || "") + " toque apito " + t.s, act:"prAbrir", arg:"toques|" + t.id})),
  ...LISTAS.flatMap(L => L.cats.map(c => { const ci = catInfo(L, c.c); return {tipo:"Precedência", t:"Categoria " + c.c + " · " + L.n, sub:"Decreto 70.274 · " + ci.boys + " boys · precedência de " + ci.eq, txt:"decreto 70.274 precedência categoria autoridade boys " + c.i.join(" "), act:"prAbrir", arg:"aut|" + L.id + "-" + c.c}; })),
  {tipo:"Marinharia", t:"Datas festivas", sub:"Grande e pequena gala", txt:"datas festivas grande gala pequena gala embandeiramento em arco salva 21 tiros independência proclamação república tiradentes riachuelo bandeira marinheiro natal", act:"prAbrir", arg:"datas"}
];
})();
