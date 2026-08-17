export const CATEGORIES = [
  "survival",
  "knowledge",
  "living",
  "conflict",
  "planet",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type MetricCandidate = {
  slug: string;
  name: string;
  shortLabel: string;
  unit: string;
  description: string;
  methodologyNote: string;
  category: Category;
  higherIsBetter: boolean;
  worldBankCode: string;
  decimals: number;
  sortOrder: number;
  source: {
    name: string;
    organization: string;
    homepageUrl: string;
    dataUrl: string;
    license: string;
  };
};

export const CHAPTERS: Record<
  Category,
  { title: string; eyebrow: string }
> = {
  survival: { title: "Survival", eyebrow: "Population, health and longevity" },
  knowledge: { title: "Knowledge", eyebrow: "Literacy" },
  living: {
    title: "Living standards",
    eyebrow: "Poverty, inequality, energy, water, food",
  },
  conflict: { title: "Conflict", eyebrow: "Battle deaths" },
  planet: { title: "Planet", eyebrow: "Climate, energy, land" },
};

export const METRIC_CANDIDATES: MetricCandidate[] = [
  {
    slug: "world-population",
    name: "World population",
    shortLabel: "Population",
    unit: "people",
    description:
      "The midyear de facto world population: all residents, regardless of legal status or citizenship.",
    methodologyNote:
      "World aggregate published by the World Bank World Development Indicators (SP.POP.TOTL), sourced from the United Nations Population Division World Population Prospects and national statistical offices. Midyear estimates. This is the published World total, not a sum computed from country rows. Only years with a published World value are shown.",
    category: "survival",
    higherIsBetter: true,
    worldBankCode: "SP.POP.TOTL",
    decimals: 0,
    sortOrder: 5,
    source: {
      name: "World Population Prospects",
      organization: "UN DESA Population Division",
      homepageUrl: "https://population.un.org/wpp/",
      dataUrl: "https://data.worldbank.org/indicator/SP.POP.TOTL",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "life-expectancy",
    name: "Life expectancy at birth",
    shortLabel: "Life expectancy",
    unit: "years",
    description:
      "The number of years a newborn would live if prevailing patterns of mortality at the time of birth stayed the same throughout its life.",
    methodologyNote:
      "World aggregate published by the World Bank World Development Indicators, sourced from the United Nations Population Division World Population Prospects and national statistical offices. Only years with a published World value are shown.",
    category: "survival",
    higherIsBetter: true,
    worldBankCode: "SP.DYN.LE00.IN",
    decimals: 1,
    sortOrder: 10,
    source: {
      name: "World Population Prospects",
      organization: "UN DESA Population Division",
      homepageUrl: "https://population.un.org/wpp/",
      dataUrl: "https://data.worldbank.org/indicator/SP.DYN.LE00.IN",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "infant-mortality",
    name: "Infant mortality rate",
    shortLabel: "Infant mortality",
    unit: "deaths before age 1 per 1,000 live births",
    description:
      "The number of infants dying before reaching one year of age, per 1,000 live births in a given year.",
    methodologyNote:
      "Official UN Inter-agency Group for Child Mortality Estimation (UN IGME) series, accessed via World Bank WDI. UN IGME is UNICEF, WHO, the World Bank, and UN DESA. Only years with a published World value are shown.",
    category: "survival",
    higherIsBetter: false,
    worldBankCode: "SP.DYN.IMRT.IN",
    decimals: 1,
    sortOrder: 20,
    source: {
      name: "UN IGME child mortality estimates",
      organization: "UN IGME (UNICEF, WHO, World Bank, UN DESA)",
      homepageUrl: "https://childmortality.org",
      dataUrl: "https://data.worldbank.org/indicator/SP.DYN.IMRT.IN",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "maternal-mortality",
    name: "Maternal mortality ratio",
    shortLabel: "Maternal mortality",
    unit: "deaths per 100,000 live births",
    description:
      "The number of women who die from pregnancy-related causes while pregnant or within 42 days of pregnancy termination, per 100,000 live births.",
    methodologyNote:
      "Official UN Maternal Mortality Estimation Inter-Agency Group (MMEIG) series — WHO, UNICEF, UNFPA, World Bank, and UN DESA — accessed via World Bank WDI. Estimates are modeled. Only years with a published World value are shown.",
    category: "survival",
    higherIsBetter: false,
    worldBankCode: "SH.STA.MMRT",
    decimals: 0,
    sortOrder: 30,
    source: {
      name: "UN MMEIG maternal mortality estimates",
      organization: "UN MMEIG (WHO, UNICEF, UNFPA, World Bank, UN DESA)",
      homepageUrl:
        "https://www.who.int/data/gho/data/themes/maternal-and-reproductive-health/maternal-mortality-ratio",
      dataUrl: "https://data.worldbank.org/indicator/SH.STA.MMRT",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "measles-immunization",
    name: "Measles immunization",
    shortLabel: "Measles immunization",
    unit: "% of children ages 12–23 months",
    description:
      "The percentage of children ages 12–23 months who received the measles vaccination before 12 months or at any time before the survey.",
    methodologyNote:
      "Official WHO / UNICEF Estimates of National Immunization Coverage, accessed via World Bank WDI. Only years with a published World value are shown.",
    category: "survival",
    higherIsBetter: true,
    worldBankCode: "SH.IMM.MEAS",
    decimals: 0,
    sortOrder: 40,
    source: {
      name: "WHO / UNICEF immunization coverage estimates",
      organization: "WHO and UNICEF",
      homepageUrl: "https://immunizationdata.who.int/",
      dataUrl: "https://data.worldbank.org/indicator/SH.IMM.MEAS",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "adult-literacy",
    name: "Adult literacy rate",
    shortLabel: "Adult literacy",
    unit: "% of people ages 15 and above",
    description:
      "The percentage of people ages 15 and above who can both read and write with understanding a short simple statement about their everyday life.",
    methodologyNote:
      "Official UNESCO Institute for Statistics (UIS) series, the custodian of SDG 4.6.2, accessed via World Bank WDI. Many high-income countries no longer report traditional literacy statistics. UIS may fill some gaps with its documented Global Age-specific Literacy Projections Model (GALP). This app never computes a world average. Only years with a published World value are shown.",
    category: "knowledge",
    higherIsBetter: true,
    worldBankCode: "SE.ADT.LITR.ZS",
    decimals: 1,
    sortOrder: 50,
    source: {
      name: "UNESCO Institute for Statistics",
      organization: "UNESCO UIS",
      homepageUrl: "https://databrowser.uis.unesco.org/",
      dataUrl: "https://data.worldbank.org/indicator/SE.ADT.LITR.ZS",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "extreme-poverty",
    name: "Extreme poverty",
    shortLabel: "Extreme poverty",
    unit: "% of population below $3.00/day (2021 PPP)",
    description:
      "The percentage of the population living on less than $3.00 a day at 2021 purchasing-power-parity prices, the current World Bank international extreme-poverty line.",
    methodologyNote:
      "Official World Bank Poverty and Inequality Platform series (SDG 1.1.1), accessed via World Bank WDI. The current line is $3.00/day in 2021 PPP, not the retired $2.15/day (2017 PPP) line. Only years with a published World value are shown.",
    category: "living",
    higherIsBetter: false,
    worldBankCode: "SI.POV.DDAY",
    decimals: 1,
    sortOrder: 60,
    source: {
      name: "Poverty and Inequality Platform",
      organization: "World Bank",
      homepageUrl: "https://pip.worldbank.org/",
      dataUrl: "https://data.worldbank.org/indicator/SI.POV.DDAY",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "top-10-income-share",
    name: "Top 10% income share",
    shortLabel: "Top 10% income",
    unit: "% of pre-tax national income",
    description:
      "The share of global pre-tax national income received by the richest 10% of adults, splitting household income equally between spouses.",
    methodologyNote:
      "World Inequality Database series sptincj992, percentile p90p100, from the published World (WO) file. This is WID's global interpersonal distribution of pre-tax national income among equal-split adults aged 20 and over — not a World Bank country Gini, and not WDI SI.DST.10TH.10, which has no World row. WID publishes shares as a 0–1 fraction; they are shown as percent. Sparse reconstructed World estimates before the annual series are omitted. Only years with a published World value are shown.",
    category: "living",
    higherIsBetter: false,
    worldBankCode: "sptincj992",
    decimals: 1,
    sortOrder: 65,
    source: {
      name: "World Inequality Database",
      organization: "World Inequality Lab",
      homepageUrl: "https://wid.world/",
      dataUrl: "https://wid.world/bulk_download/WID_data_WO.csv",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "electricity-access",
    name: "Access to electricity",
    shortLabel: "Electricity access",
    unit: "% of population",
    description:
      "The percentage of the population with access to electricity.",
    methodologyNote:
      "Official SDG 7.1.1 electrification series from Tracking SDG7 / ESMAP (World Bank, IEA, IRENA, UNSD, WHO), accessed via World Bank WDI. Only years with a published World value are shown.",
    category: "living",
    higherIsBetter: true,
    worldBankCode: "EG.ELC.ACCS.ZS",
    decimals: 1,
    sortOrder: 70,
    source: {
      name: "Tracking SDG7 electrification dataset",
      organization: "ESMAP / World Bank, IEA, IRENA, UNSD, WHO",
      homepageUrl: "https://trackingsdg7.esmap.org/",
      dataUrl: "https://data.worldbank.org/indicator/EG.ELC.ACCS.ZS",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "basic-drinking-water",
    name: "Basic drinking water",
    shortLabel: "Basic drinking water",
    unit: "% of population",
    description:
      "The percentage of the population using at least basic drinking water services.",
    methodologyNote:
      "Official WHO / UNICEF Joint Monitoring Programme (JMP) series for SDG 6.1, accessed via World Bank WDI. Only years with a published World value are shown.",
    category: "living",
    higherIsBetter: true,
    worldBankCode: "SH.H2O.BASW.ZS",
    decimals: 1,
    sortOrder: 80,
    source: {
      name: "WHO / UNICEF Joint Monitoring Programme",
      organization: "WHO and UNICEF JMP",
      homepageUrl: "https://washdata.org/",
      dataUrl: "https://data.worldbank.org/indicator/SH.H2O.BASW.ZS",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "undernourishment",
    name: "Prevalence of undernourishment",
    shortLabel: "Undernourishment",
    unit: "% of population",
    description:
      "The percentage of the population whose habitual food consumption is insufficient to provide the dietary energy levels required to maintain a normal, active, and healthy life.",
    methodologyNote:
      "Official FAO series for SDG 2.1.1, accessed via World Bank WDI. Only years with a published World value are shown.",
    category: "living",
    higherIsBetter: false,
    worldBankCode: "SN.ITK.DEFC.ZS",
    decimals: 1,
    sortOrder: 90,
    source: {
      name: "FAOSTAT undernourishment estimates",
      organization: "Food and Agriculture Organization of the United Nations",
      homepageUrl: "https://www.fao.org/faostat/",
      dataUrl: "https://data.worldbank.org/indicator/SN.ITK.DEFC.ZS",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "co2-total",
    name: "CO₂ emissions (total)",
    shortLabel: "CO₂ total",
    unit: "Mt CO₂e, excluding LULUCF",
    description:
      "Annual carbon dioxide emissions from agriculture, energy, waste, and industry, excluding land use, land-use change, and forestry, in million tonnes of CO₂ equivalent.",
    methodologyNote:
      "Current World Bank WDI greenhouse-gas series (EN.GHG.CO2.MT.CE.AR5), sourced from the European Commission JRC EDGAR Community GHG Database and the IEA. This is the published World total, not a sum computed from country rows. Only years with a published World value are shown.",
    category: "planet",
    higherIsBetter: false,
    worldBankCode: "EN.GHG.CO2.MT.CE.AR5",
    decimals: 0,
    sortOrder: 95,
    source: {
      name: "EDGAR Community GHG Database",
      organization: "European Commission JRC and IEA",
      homepageUrl: "https://edgar.jrc.ec.europa.eu/",
      dataUrl: "https://data.worldbank.org/indicator/EN.GHG.CO2.MT.CE.AR5",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "co2-per-capita",
    name: "CO₂ emissions per capita",
    shortLabel: "CO₂ per capita",
    unit: "t CO₂e per capita, excluding LULUCF",
    description:
      "Annual carbon dioxide emissions excluding land use, land-use change, and forestry, divided by population, in tonnes of CO₂ equivalent per person.",
    methodologyNote:
      "Current World Bank WDI greenhouse-gas series (EN.GHG.CO2.PC.CE.AR5), sourced from the European Commission JRC EDGAR Community GHG Database and the IEA. The retired WDI code EN.ATM.CO2E.PC is not used. Only years with a published World value are shown.",
    category: "planet",
    higherIsBetter: false,
    worldBankCode: "EN.GHG.CO2.PC.CE.AR5",
    decimals: 2,
    sortOrder: 100,
    source: {
      name: "EDGAR Community GHG Database",
      organization: "European Commission JRC and IEA",
      homepageUrl: "https://edgar.jrc.ec.europa.eu/",
      dataUrl: "https://data.worldbank.org/indicator/EN.GHG.CO2.PC.CE.AR5",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "methane",
    name: "Methane emissions (total)",
    shortLabel: "Methane",
    unit: "Mt CO₂e, excluding LULUCF",
    description:
      "Annual methane (CH₄) emissions from agriculture, energy, waste, and industry, excluding land use, land-use change, and forestry, in million tonnes of CO₂ equivalent.",
    methodologyNote:
      "Current World Bank WDI greenhouse-gas series (EN.GHG.CH4.MT.CE.AR5), sourced from the European Commission JRC EDGAR Community GHG Database and the IEA. Values use IPCC AR5 100-year global warming potentials. This is the published World total, not a sum computed from country rows. Only years with a published World value are shown.",
    category: "planet",
    higherIsBetter: false,
    worldBankCode: "EN.GHG.CH4.MT.CE.AR5",
    decimals: 0,
    sortOrder: 105,
    source: {
      name: "EDGAR Community GHG Database",
      organization: "European Commission JRC and IEA",
      homepageUrl: "https://edgar.jrc.ec.europa.eu/",
      dataUrl: "https://data.worldbank.org/indicator/EN.GHG.CH4.MT.CE.AR5",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "forest-area",
    name: "Forest area",
    shortLabel: "Forest area",
    unit: "% of land area",
    description:
      "The share of land under natural or planted stands of trees at least 5 meters tall, whether productive or not. Excludes trees in agricultural production systems such as fruit plantations and agroforestry, and trees in urban parks and gardens.",
    methodologyNote:
      "Official FAO series for SDG 15.1.1 from the Global Forest Resources Assessment, accessed via World Bank WDI (AG.LND.FRST.ZS). This is the published World share, not an average computed from country rows. Only years with a published World value are shown.",
    category: "planet",
    higherIsBetter: true,
    worldBankCode: "AG.LND.FRST.ZS",
    decimals: 1,
    sortOrder: 110,
    source: {
      name: "Global Forest Resources Assessment",
      organization: "Food and Agriculture Organization of the United Nations",
      homepageUrl: "https://www.fao.org/forest-resources-assessment/",
      dataUrl: "https://data.worldbank.org/indicator/AG.LND.FRST.ZS",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "renewable-energy",
    name: "Renewable energy consumption",
    shortLabel: "Renewable energy",
    unit: "% of total final energy consumption",
    description:
      "The share of total final energy consumption that comes from renewable sources, including hydro, wind, solar, geothermal, and biomass.",
    methodologyNote:
      "Official SDG 7.2.1 series from Tracking SDG7 (IEA, IRENA, UNSD, World Bank, WHO), accessed via World Bank WDI (EG.FEC.RNEW.ZS). Includes traditional biomass as well as modern renewables, so the World share can fall while wind and solar grow. Only years with a published World value are shown.",
    category: "planet",
    higherIsBetter: true,
    worldBankCode: "EG.FEC.RNEW.ZS",
    decimals: 1,
    sortOrder: 115,
    source: {
      name: "Tracking SDG7 renewable energy dataset",
      organization: "IEA, IRENA, UNSD, World Bank, WHO",
      homepageUrl: "https://trackingsdg7.esmap.org/",
      dataUrl: "https://data.worldbank.org/indicator/EG.FEC.RNEW.ZS",
      license: "CC BY 4.0",
    },
  },
  {
    slug: "battle-deaths",
    name: "Battle-related deaths",
    shortLabel: "Battle deaths",
    unit: "deaths",
    description:
      "The number of people killed in battle-related incidents in state-based armed conflicts: combatants and civilians who die as a direct result of fighting.",
    methodologyNote:
      "Uppsala Conflict Data Program (UCDP) Battle-Related Deaths Dataset, conflict-year file (bd_best). World Bank WDI redistributes this series as VC.BTL.DETH but leaves the World row empty, so the World total is taken from UCDP: the sum of each conflict-year best estimate (one row per conflict and year, no country averaging). Direct battle deaths only — not famine, disease, or other indirect war deaths. Not a share of all deaths.",
    category: "conflict",
    higherIsBetter: false,
    worldBankCode: "VC.BTL.DETH",
    decimals: 0,
    sortOrder: 120,
    source: {
      name: "UCDP Battle-Related Deaths Dataset",
      organization: "Uppsala Conflict Data Program, Uppsala University",
      homepageUrl: "https://ucdp.uu.se/",
      dataUrl: "https://ucdp.uu.se/downloads/brd/ucdp-brd-conf-261-csv.zip",
      license: "CC BY 4.0",
    },
  },
];

export function getCandidate(slug: string) {
  return METRIC_CANDIDATES.find((metric) => metric.slug === slug);
}
