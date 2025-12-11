import { WeakSignal, SearchParams } from '../types';

// SIMULATION MODE: These are illustrative examples for demonstration purposes
// Real searches require a Perplexity API key and use live, verifiable sources
const MOCK_SIGNALS_POOL: Omit<WeakSignal, 'id'>[] = [
  {
    title: 'Decentralized Autonomous Organizations (DAOs) in Public Service Delivery',
    description: 'Emerging blockchain-based governance structures enabling citizen-led municipal service management',
    driverCategory: 'Technological',
    evidence: 'Pilot programs in Estonia and South Korea show 23% reduction in administrative overhead; 15+ cities experimenting with DAO-based participatory budgeting',
    caseStudy: 'Seoul MetaGov DAO manages $2M in urban improvement funds with 45,000 active citizen participants, demonstrating scalable digital civic engagement',
    relevanceNote: 'Could transform World Bank governance lending by enabling direct citizen oversight of project funds, reducing corruption risks and enhancing transparency in public financial management',
    source: 'Simulation Mode - Illustrative Example',
    impact: 8,
    uncertainty: 7,
    probability: 6,
    impactRationale: 'High impact as DAOs could transform $15B+ annual governance lending portfolio by enabling direct citizen oversight and reducing intermediary costs.',
    uncertaintyRationale: 'High uncertainty due to untested regulatory frameworks, technical vulnerabilities, and questions about scalability in low-connectivity environments.',
    probabilityRationale: 'Medium probability given successful pilots, but requires regulatory clarity and technology maturity that may take 5-7 years.',
  },
  {
    title: 'Subsidence Crisis Accelerating in Major Delta Cities',
    description: 'Groundwater extraction and urban development causing catastrophic land subsidence at rates exceeding climate projections',
    driverCategory: 'Environmental',
    evidence: 'Jakarta sinking 25cm/year, Bangkok 10cm/year; World Resources Institute identifies 33 megacities at critical risk; Insurance industry reclassifying flood zones',
    caseStudy: 'Jakarta relocating capital to Borneo ($33B project) due to subsidence making 40% of city below sea level by 2050, affecting 10M residents',
    relevanceNote: 'Threatens $280B in World Bank urban development portfolio; requires fundamental reassessment of coastal city infrastructure lending and climate adaptation frameworks',
    source: 'Simulation Mode - Illustrative Example',
    impact: 9,
    uncertainty: 4,
    probability: 9,
    impactRationale: 'Critical impact on $280B urban portfolio, forcing wholesale rethinking of coastal city investments and potentially stranding billions in infrastructure assets.',
    uncertaintyRationale: 'Low uncertainty as subsidence rates are well-documented and irreversible; primary uncertainty is speed of policy response.',
    probabilityRationale: 'Very high probability as physical processes are already underway and affecting 1B+ urban residents globally by 2040.',
  },
  {
    title: 'Gene-Edited Nitrogen-Fixing Cereals Entering Field Trials',
    description: 'CRISPR-modified wheat and rice varieties that capture atmospheric nitrogen, eliminating fertilizer dependency',
    driverCategory: 'Technological',
    evidence: 'Three independent research teams published successful lab results; Chinese Academy of Sciences beginning 5-year field trials; Gates Foundation investing $250M',
    caseStudy: 'If successful, could disrupt $200B global fertilizer industry and transform agricultural economics in sub-Saharan Africa where fertilizer costs are 2-3x global average',
    relevanceNote: 'Could revolutionize World Bank agricultural lending strategy, reduce dependency on fertilizer imports, and dramatically improve smallholder farmer profitability while reducing environmental impacts',
    source: 'Simulation Mode - Illustrative Example',
    impact: 9,
    uncertainty: 8,
    probability: 5,
    impactRationale: 'Critical impact affecting $8B agricultural portfolio and fundamentally altering development economics for 500M+ smallholder farmers globally.',
    uncertaintyRationale: 'Extreme uncertainty around field performance, regulatory approval timelines, and farmer adoption rates in diverse agroecological zones.',
    probabilityRationale: 'Low-medium probability given technical breakthroughs, but 10-15 year timeline to commercial scale with significant regulatory and social acceptance hurdles.',
  },
  {
    title: 'Micro-Nuclear Reactors for Rural Electrification',
    description: 'Factory-produced 1-10MW nuclear units designed for remote deployment without grid connection',
    driverCategory: 'Technological',
    evidence: 'NuScale received US regulatory approval; 12 countries expressing interest; Canada deploying first units in mining communities 2025',
    caseStudy: 'Saskatchewan planning 4-unit deployment to replace diesel generators serving 25,000 people, projecting 60% cost reduction over 20-year lifecycle',
    relevanceNote: 'Could leapfrog traditional grid extension in remote areas; challenges World Bank renewable energy strategy; requires new nuclear governance frameworks for client countries',
    source: 'Simulation Mode - Illustrative Example',
    impact: 7,
    uncertainty: 6,
    probability: 7,
    impactRationale: 'High impact on $4B energy access portfolio, offering alternative to diesel and intermittent renewables in off-grid contexts.',
    uncertaintyRationale: 'Medium-high uncertainty around deployment costs, safety perceptions, and institutional capacity requirements in developing countries.',
    probabilityRationale: 'High probability given regulatory approvals and commercial interest, but 5-8 year timeline to widespread deployment.',
  },
  {
    title: 'Platform Cooperatives Disrupting Digital Labor Markets',
    description: 'Worker-owned alternatives to gig economy platforms redistributing value to labor providers in emerging markets',
    driverCategory: 'Economic',
    evidence: 'Platform co-ops growing 40% annually; aggregate $2B GMV; successful models in transport (Brazil), delivery (India), and freelancing (Kenya)',
    caseStudy: 'Nairobi-based Kazi Co-op captures 15% local ride-sharing market, with drivers earning 30% more than Uber equivalents while building equity ownership',
    relevanceNote: 'Challenges assumptions about digital economy development pathways; offers alternative to extractive platform capitalism that better aligns with World Bank inclusive growth objectives',
    source: 'Simulation Mode - Illustrative Example',
    impact: 7,
    uncertainty: 6,
    probability: 7,
    impactRationale: 'High impact potential affecting digital economy strategies and labor market interventions across middle-income countries with large informal sectors.',
    uncertaintyRationale: 'Medium-high uncertainty due to capital constraints, network effects favoring incumbents, and regulatory ambiguity.',
    probabilityRationale: 'High probability in specific sectors and geographies where traditional platforms face regulatory pressure or labor organization.',
  },
  {
    title: 'AI-Powered Precision Public Services Emerging in Smart Cities',
    description: 'Machine learning systems enabling hyper-personalized delivery of education, healthcare, and social protection at scale',
    driverCategory: 'Technological',
    evidence: 'Singapore, Dubai, and Shenzhen deploying AI service optimization; early results show 35% cost reduction and 50% improved targeting accuracy',
    caseStudy: 'Estonia AI-driven social benefit system reduced administrative burden by 60% while improving benefit accuracy and reducing fraud by $40M annually',
    relevanceNote: 'Could transform World Bank human capital and social protection approaches, but raises critical data governance and equity concerns requiring new safeguards',
    source: 'Simulation Mode - Illustrative Example',
    impact: 8,
    uncertainty: 7,
    probability: 8,
    impactRationale: 'High impact on $12B+ social protection portfolio, enabling precision targeting and real-time responsiveness previously impossible.',
    uncertaintyRationale: 'High uncertainty around algorithmic bias, data privacy frameworks, and political acceptability in diverse governance contexts.',
    probabilityRationale: 'High probability given rapid technology maturation and government interest, but implementation challenges vary widely.',
  },
  {
    title: 'Mass Youth Emigration from Middle-Income Countries',
    description: 'Brain drain accelerating in Latin America and Eastern Europe as digital nomad visas and remote work enable unprecedented mobility',
    driverCategory: 'Social',
    evidence: 'Argentina lost 15% of university graduates 2020-2024; Poland experiencing first population decline; Portugal issued 65,000 digital nomad visas in 2023',
    caseStudy: 'Costa Rica estimates 30% of IT workforce now working remotely for foreign companies while residing abroad, collapsing tax base and pension systems',
    relevanceNote: 'Threatens human capital development outcomes of World Bank education investments; may require fundamental rethinking of economic development models for middle-income countries',
    source: 'Simulation Mode - Illustrative Example',
    impact: 8,
    uncertainty: 5,
    probability: 8,
    impactRationale: 'High impact on human capital investments, threatening World Bank education portfolio returns and middle-income country development trajectories.',
    uncertaintyRationale: 'Medium uncertainty as remote work trends are established, but policy responses and scale remain variable.',
    probabilityRationale: 'High probability given established trends in digital mobility and workforce transformation already underway.',
  },
  {
    title: 'Sovereign Wealth Funds Divesting from Traditional Development Banks',
    description: 'Major sovereign investors shifting capital from multilateral institutions to direct bilateral climate investments',
    driverCategory: 'Economic',
    evidence: 'Norway Pension Fund reduced World Bank bond holdings by 40% 2022-2024; UAE and Saudi funds creating $150B direct climate investment vehicles',
    caseStudy: 'Qatar Investment Authority bypassing multilaterals to directly fund solar projects in Africa, offering better terms and faster deployment than traditional development finance',
    relevanceNote: 'Could undermine World Bank financial model and market position; signals client preference for alternative financing structures; requires competitive response',
    source: 'Simulation Mode - Illustrative Example',
    impact: 7,
    uncertainty: 6,
    probability: 7,
    impactRationale: 'High impact on World Bank financial model and competitive position in development finance market.',
    uncertaintyRationale: 'Medium-high uncertainty around scale of divestment and whether trend accelerates or stabilizes.',
    probabilityRationale: 'High probability given established sovereign wealth fund diversification strategies and bilateral investment trends.',
  },
  {
    title: 'Automated Border Biometric Systems Creating Stateless Populations',
    description: 'AI-powered border control rejecting refugees and migrants based on algorithmic risk assessment, leaving thousands in legal limbo',
    driverCategory: 'Legal',
    evidence: 'EU iBorderCtrl system rejected 38% of asylum seekers with no human review; UNHCR documenting 12,000 cases of algorithmic denial',
    caseStudy: 'Greek automated asylum system created 4,200 stateless individuals in 2023, triggering humanitarian crisis and ECHR legal challenges',
    relevanceNote: 'Creates new vulnerable populations not covered by World Bank fragility frameworks; challenges assumptions about refugee integration projects and social protection systems',
    source: 'Simulation Mode - Illustrative Example',
    impact: 6,
    uncertainty: 5,
    probability: 7,
    impactRationale: 'Medium-high impact creating new vulnerable populations requiring World Bank fragility and social protection interventions.',
    uncertaintyRationale: 'Medium uncertainty as AI border systems are being deployed, but legal frameworks and human rights protections remain contested.',
    probabilityRationale: 'High probability given acceleration of automated border control technology deployment across multiple regions.',
  },
  {
    title: 'Geoengineering Unilateral Deployment by Small Nations',
    description: 'Smaller countries considering stratospheric aerosol injection as climate defense without international consensus',
    driverCategory: 'Political',
    evidence: 'Philippines Congressional Committee approved $50M research budget; Pacific Island nations forming geoengineering coalition; technology costs dropped 90% since 2020',
    caseStudy: 'Tuvalu threatened to deploy solar radiation management if COP30 fails to deliver adaptation finance, triggering diplomatic crisis with Australia and China',
    relevanceNote: 'Could destabilize global climate governance; World Bank climate investments may face unprecedented geopolitical risk; requires new conflict prevention and environmental safeguards',
    source: 'Simulation Mode - Illustrative Example',
    impact: 10,
    uncertainty: 9,
    probability: 4,
    impactRationale: 'Critical impact potentially destabilizing global climate governance and creating unprecedented geopolitical risks for all World Bank operations.',
    uncertaintyRationale: 'Extreme uncertainty around technical outcomes, international response, and environmental consequences of unilateral deployment.',
    probabilityRationale: 'Low-medium probability due to high barriers, but desperation from climate-vulnerable nations increases risk.',
  },
  {
    title: 'Corporate Water Rights Superseding National Sovereignty',
    description: 'International arbitration cases establishing precedent for corporate water extraction rights over community access',
    driverCategory: 'Legal',
    evidence: '17 ISDS cases filed 2023-2024; mining companies winning majority of water rights disputes; $4.2B in government penalties awarded',
    caseStudy: 'Chilean government forced to pay $800M to mining company after restricting water extraction during drought, setting precedent that threatens national water governance',
    relevanceNote: 'Undermines World Bank water security and governance projects; investment arbitration system may be incompatible with climate adaptation needs; requires policy reform',
    source: 'Simulation Mode - Illustrative Example',
    impact: 8,
    uncertainty: 5,
    probability: 8,
    impactRationale: 'High impact undermining water security projects and creating tensions between investment protection and climate adaptation needs.',
    uncertaintyRationale: 'Medium uncertainty as arbitration precedents are evolving, but direction favoring corporate rights is increasingly clear.',
    probabilityRationale: 'High probability given established ISDS case trends and growing resource scarcity driving conflicts.',
  },
  {
    title: 'Pandemic-Induced Permanent Shift to Asynchronous Education',
    description: 'Universities and schools abandoning synchronous instruction for self-paced digital learning, disrupting traditional education models',
    driverCategory: 'Social',
    evidence: 'Arizona State University 70% asynchronous by 2024; completion rates equal to traditional; 40% cost reduction; student satisfaction +15%',
    caseStudy: 'Rwanda pivoting national education strategy to asynchronous-first model, potentially leapfrogging teacher shortage and infrastructure constraints',
    relevanceNote: 'Could transform World Bank education sector approach; challenges assumptions about school construction and teacher training investments; enables radical cost reduction',
    source: 'Simulation Mode - Illustrative Example',
    impact: 7,
    uncertainty: 6,
    probability: 7,
    impactRationale: 'High impact potentially transforming education sector lending and challenging traditional school infrastructure investment models.',
    uncertaintyRationale: 'Medium-high uncertainty around learning outcomes, equity implications, and scalability in low-connectivity environments.',
    probabilityRationale: 'High probability given successful pilots and cost advantages, but implementation barriers vary by context.',
  },
  {
    title: 'Pension System Collapse in Aging Societies Triggering Migration Crises',
    description: 'Unfunded pension liabilities in Southern Europe and East Asia forcing austerity that drives mass elderly migration',
    driverCategory: 'Economic',
    evidence: 'Italy pension deficit reaches 18% of GDP; Japan raising retirement age to 70; Greece pension cuts average 40%; elderly poverty rates doubling',
    caseStudy: 'Portugal experiencing reverse migration as retirees relocate to former colonies with lower costs, creating unexpected demographic pressures in Mozambique and Angola',
    relevanceNote: 'Challenges World Bank demographic transition frameworks; requires new approaches to social protection and fiscal sustainability in aging client countries',
    source: 'Simulation Mode - Illustrative Example',
    impact: 8,
    uncertainty: 4,
    probability: 9,
    impactRationale: 'High impact forcing fundamental rethinking of social protection systems and fiscal sustainability frameworks in aging economies.',
    uncertaintyRationale: 'Low-medium uncertainty as pension deficits are well-documented and structural; primary uncertainty is policy response timing.',
    probabilityRationale: 'Very high probability as demographic and fiscal pressures are irreversible and already driving policy changes.',
  },
  {
    title: 'Synthetic Biology Enabling On-Site Pharmaceutical Manufacturing',
    description: 'Bioengineered microorganisms in shipping-container labs producing medicines locally, disrupting pharmaceutical supply chains',
    driverCategory: 'Technological',
    evidence: 'Gates Foundation deploying 50 units across Africa; WHO validating output quality; production cost 80% below imports for essential medicines',
    caseStudy: 'Kenya manufacturing insulin locally at $3/vial vs. $45 imported, achieving medicine security and demonstrating model for other biologics',
    relevanceNote: 'Could revolutionize World Bank health systems strengthening; reduces dependency on pharmaceutical imports; requires new regulatory capacity building approach',
    source: 'Simulation Mode - Illustrative Example',
    impact: 8,
    uncertainty: 5,
    probability: 8,
    impactRationale: 'High impact revolutionizing health systems strengthening and pharmaceutical security in developing countries.',
    uncertaintyRationale: 'Medium uncertainty around regulatory acceptance, quality assurance systems, and scaling production across diverse contexts.',
    probabilityRationale: 'High probability given successful pilots, WHO validation, and dramatic cost advantages driving adoption.',
  },
];

export const generateMockSignals = (params: SearchParams): WeakSignal[] => {
  const { domain, geography, timeline } = params;

  const relevantSignals = MOCK_SIGNALS_POOL.filter(signal => {
    const domainMatch = signal.title.toLowerCase().includes(domain.toLowerCase()) ||
                       signal.description.toLowerCase().includes(domain.toLowerCase()) ||
                       signal.relevanceNote.toLowerCase().includes(domain.toLowerCase());

    const geoMatch = !geography ||
                    signal.caseStudy.toLowerCase().includes(geography.toLowerCase()) ||
                    signal.evidence.toLowerCase().includes(geography.toLowerCase());

    return domainMatch || geoMatch || Math.random() > 0.5;
  });

  const targetCount = 20;
  let selectedSignals: typeof MOCK_SIGNALS_POOL = [];

  if (relevantSignals.length >= targetCount) {
    selectedSignals = relevantSignals.slice(0, targetCount);
  } else {
    selectedSignals = [...relevantSignals];
    const remaining = MOCK_SIGNALS_POOL.filter(s => !selectedSignals.includes(s));
    const needed = targetCount - selectedSignals.length;

    for (let i = 0; i < needed && i < remaining.length; i++) {
      selectedSignals.push(remaining[i]);
    }

    while (selectedSignals.length < targetCount && MOCK_SIGNALS_POOL.length > 0) {
      selectedSignals.push(MOCK_SIGNALS_POOL[selectedSignals.length % MOCK_SIGNALS_POOL.length]);
    }
  }

  return selectedSignals.map((signal, idx) => ({
    ...signal,
    id: `signal-${Date.now()}-${idx}`,
  }));
};
