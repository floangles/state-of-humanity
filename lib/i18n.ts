import type { Category } from "@/lib/metrics-catalog";

export const LOCALES = ["en", "fr"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_STORAGE_KEY = "state-of-humanity-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  fr: "Français",
};

type MetricCopy = {
  name: string;
  shortLabel: string;
  unit: string;
  description: string;
  methodologyNote: string;
};

type Dictionary = {
  brand: string;
  navWorld: string;
  navSources: string;
  heroEyebrow: string;
  heroTitle: string;
  heroLead: string;
  scrubberLabel: string;
  scrubberHint: string;
  thenVs: (year: number) => string;
  thenVsHint: string;
  noEstimate: string;
  lastReading: (year: number) => string;
  better: string;
  worse: string;
  unchanged: string;
  vs: string;
  openSeries: string;
  lastIngested: (date: string) => string;
  accessChannel: string;
  droppedCandidates: (count: number) => string;
  allShipped: (count: number) => string;
  seeSources: string;
  chapters: Record<Category, { title: string; eyebrow: string }>;
  categoryLabels: Record<Category, string>;
  metricPage: {
    back: string;
    firstPoint: (year: number) => string;
    latestPoint: (year: number) => string;
    publishedPoints: string;
    chartGaps: string;
    howBuilt: string;
    source: string;
    producer: string;
    series: string;
    wdiCode: string;
    license: string;
    fetched: string;
    wdiLink: string;
    producerLink: string;
  };
  sourcesPage: {
    eyebrow: string;
    title: string;
    lead: string;
    access: (date: string) => string;
    colMetric: string;
    colProducer: string;
    colCode: string;
    colPoints: string;
    colLicense: string;
    colLinks: string;
    dataLink: string;
    producerLink: string;
    droppedTitle: string;
    droppedLead: string;
  };
  notFound: {
    title: string;
    body: string;
    back: string;
  };
};

export const DICTIONARIES: Record<Locale, Dictionary> = {
  en: {
    brand: "State of Humanity",
    navWorld: "World",
    navSources: "Sources",
    heroEyebrow: "World · official series only",
    heroTitle: "State of Humanity",
    heroLead:
      "Published World aggregates from UN agencies, the World Bank, WHO, UNESCO, FAO, the European Commission JRC, and the World Inequality Lab.",
    scrubberLabel: "Official World estimates",
    scrubberHint:
      "A tile shows a number only if the producer published a World value for that year.",
    thenVs: (year) => `Then vs ${year}`,
    thenVsHint:
      "First official World point compared with the selected year. If that year has no World value, the last published reading is shown.",
    noEstimate: "No official estimate",
    lastReading: (year) => `Last reading ${year}`,
    better: "Better",
    worse: "Worse",
    unchanged: "Unchanged",
    vs: "vs",
    openSeries: "Open series →",
    lastIngested: (date) => `Last ingested ${date}.`,
    accessChannel:
      "Access channel: World Bank WDI (WLD), or the producer file when WDI has no World row.",
    droppedCandidates: (count) =>
      `${count} candidate${count === 1 ? "" : "s"} dropped for lack of a World series.`,
    allShipped: (count) =>
      `All ${count} candidates had a published World series.`,
    seeSources: "See sources",
    chapters: {
      survival: { title: "Survival", eyebrow: "Population, health and longevity" },
      knowledge: { title: "Knowledge", eyebrow: "Literacy" },
      living: {
        title: "Living standards",
        eyebrow: "Poverty, inequality, energy, water, food",
      },
      conflict: { title: "Conflict", eyebrow: "Battle deaths" },
      planet: { title: "Planet", eyebrow: "Climate, energy, land" },
    },
    categoryLabels: {
      survival: "Survival",
      knowledge: "Knowledge",
      living: "Living standards",
      conflict: "Conflict",
      planet: "Planet",
    },
    metricPage: {
      back: "← World",
      firstPoint: (year) => `First official point · ${year}`,
      latestPoint: (year) => `Latest official point · ${year}`,
      publishedPoints: "Published World points",
      chartGaps:
        "Gaps are years without a published World value. The line is not interpolated.",
      howBuilt: "How this series is built",
      source: "Source",
      producer: "Producer",
      series: "Series",
      wdiCode: "Series code",
      license: "License",
      fetched: "Fetched",
      wdiLink: "Data file",
      producerLink: "Producer homepage",
    },
    sourcesPage: {
      eyebrow: "Provenance",
      title: "Sources",
      lead: "Every number on this site is a published World aggregate. The app never averages country rows, never interpolates missing years, and never keeps a series with zero World points.",
      access: (date) =>
        `Access channel: World Bank WDI API (country WLD) for most series, plus producer files when WDI has no World row. License CC BY 4.0. Last ingest ${date}.`,
      colMetric: "Metric",
      colProducer: "Producer",
      colCode: "Code",
      colPoints: "Points",
      colLicense: "License",
      colLinks: "Links",
      dataLink: "Data",
      producerLink: "Producer",
      droppedTitle: "Dropped candidates",
      droppedLead:
        "These codes were requested and not shipped because the producer returned no non-null World values.",
    },
    notFound: {
      title: "Not found",
      body: "That page is not part of the shipped World series.",
      back: "Back to the world view",
    },
  },
  fr: {
    brand: "État de l'humanité",
    navWorld: "Monde",
    navSources: "Sources",
    heroEyebrow: "Monde · séries officielles uniquement",
    heroTitle: "État de l'humanité",
    heroLead:
      "Agrégats mondiaux publiés par les agences de l'ONU, la Banque mondiale, l'OMS, l'UNESCO, la FAO, le JRC de la Commission européenne et le World Inequality Lab.",
    scrubberLabel: "Estimations mondiales officielles",
    scrubberHint:
      "Une tuile n'affiche un chiffre que si le producteur a publié une valeur mondiale pour cette année.",
    thenVs: (year) => `Alors vs ${year}`,
    thenVsHint:
      "Premier point mondial officiel comparé à l'année sélectionnée. S'il n'y a pas de valeur mondiale pour cette année, le dernier relevé publié est affiché.",
    noEstimate: "Pas d'estimation officielle",
    lastReading: (year) => `Dernier relevé ${year}`,
    better: "Mieux",
    worse: "Moins bien",
    unchanged: "Stable",
    vs: "vs",
    openSeries: "Voir la série →",
    lastIngested: (date) => `Dernier ingest ${date}.`,
    accessChannel:
      "Canal d'accès : WDI Banque mondiale (WLD), ou le fichier du producteur si WDI n'a pas de ligne World.",
    droppedCandidates: (count) =>
      `${count} candidat${count === 1 ? "" : "s"} écarté${count === 1 ? "" : "s"} faute de série mondiale.`,
    allShipped: (count) =>
      `Les ${count} candidats avaient une série mondiale publiée.`,
    seeSources: "Voir les sources",
    chapters: {
      survival: { title: "Survie", eyebrow: "Population, santé et longévité" },
      knowledge: { title: "Savoir", eyebrow: "Alphabétisation" },
      living: {
        title: "Niveau de vie",
        eyebrow: "Pauvreté, inégalités, énergie, eau, alimentation",
      },
      conflict: { title: "Conflit", eyebrow: "Décès au combat" },
      planet: { title: "Planète", eyebrow: "Climat, énergie, terres" },
    },
    categoryLabels: {
      survival: "Survie",
      knowledge: "Savoir",
      living: "Niveau de vie",
      conflict: "Conflit",
      planet: "Planète",
    },
    metricPage: {
      back: "← Monde",
      firstPoint: (year) => `Premier point officiel · ${year}`,
      latestPoint: (year) => `Dernier point officiel · ${year}`,
      publishedPoints: "Points mondiaux publiés",
      chartGaps:
        "Les trous sont des années sans valeur mondiale publiée. La courbe n'est pas interpolée.",
      howBuilt: "Comment cette série est construite",
      source: "Source",
      producer: "Producteur",
      series: "Série",
      wdiCode: "Code de série",
      license: "Licence",
      fetched: "Récupéré le",
      wdiLink: "Fichier de données",
      producerLink: "Site du producteur",
    },
    sourcesPage: {
      eyebrow: "Provenance",
      title: "Sources",
      lead: "Chaque chiffre de ce site est un agrégat mondial publié. L'app ne calcule jamais de moyenne à partir des pays, n'interpole jamais les années manquantes, et ne conserve jamais une série sans point mondial.",
      access: (date) =>
        `Canal d'accès : API WDI de la Banque mondiale (pays WLD) pour la plupart des séries, plus les fichiers des producteurs quand WDI n'a pas de ligne World. Licence CC BY 4.0. Dernier ingest ${date}.`,
      colMetric: "Métrique",
      colProducer: "Producteur",
      colCode: "Code",
      colPoints: "Points",
      colLicense: "Licence",
      colLinks: "Liens",
      dataLink: "Données",
      producerLink: "Producteur",
      droppedTitle: "Candidats écartés",
      droppedLead:
        "Ces codes ont été demandés et n'ont pas été publiés, car le producteur n'a renvoyé aucune valeur mondiale non nulle.",
    },
    notFound: {
      title: "Introuvable",
      body: "Cette page ne fait pas partie des séries mondiales publiées.",
      back: "Retour à la vue mondiale",
    },
  },
};

export const METRIC_FR: Record<string, MetricCopy> = {
  "world-population": {
    name: "Population mondiale",
    shortLabel: "Population",
    unit: "personnes",
    description:
      "Population mondiale de facto au milieu de l'année : tous les résidents, quel que soit leur statut juridique ou leur citoyenneté.",
    methodologyNote:
      "Agrégat mondial publié par les Indicateurs du développement dans le monde de la Banque mondiale (SP.POP.TOTL), à partir des World Population Prospects de la Division de la population de l'ONU et des instituts nationaux de statistique. Estimations au milieu de l'année. C'est le total mondial publié, pas une somme calculée à partir des pays. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "life-expectancy": {
    name: "Espérance de vie à la naissance",
    shortLabel: "Espérance de vie",
    unit: "années",
    description:
      "Nombre d'années qu'un nouveau-né vivrait si les conditions de mortalité du moment de sa naissance restaient inchangées tout au long de sa vie.",
    methodologyNote:
      "Agrégat mondial publié par les Indicateurs du développement dans le monde de la Banque mondiale, à partir des World Population Prospects de la Division de la population de l'ONU et des instituts nationaux de statistique. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "infant-mortality": {
    name: "Taux de mortalité infantile",
    shortLabel: "Mortalité infantile",
    unit: "décès avant 1 an pour 1 000 naissances vivantes",
    description:
      "Nombre de nourrissons décédés avant d'atteindre l'âge d'un an, pour 1 000 naissances vivantes au cours d'une année donnée.",
    methodologyNote:
      "Série officielle du Groupe inter-agences des Nations unies pour l'estimation de la mortalité de l'enfant (UN IGME), via les WDI de la Banque mondiale. L'UN IGME réunit l'UNICEF, l'OMS, la Banque mondiale et l'ONU DESA. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "maternal-mortality": {
    name: "Ratio de mortalité maternelle",
    shortLabel: "Mortalité maternelle",
    unit: "décès pour 100 000 naissances vivantes",
    description:
      "Nombre de femmes décédées de causes liées à la grossesse pendant la grossesse ou dans les 42 jours suivant son terme, pour 100 000 naissances vivantes.",
    methodologyNote:
      "Série officielle du Groupe inter-agences d'estimation de la mortalité maternelle (MMEIG) — OMS, UNICEF, UNFPA, Banque mondiale et ONU DESA — via les WDI. Les estimations sont modélisées. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "measles-immunization": {
    name: "Couverture vaccinale contre la rougeole",
    shortLabel: "Vaccination rougeole",
    unit: "% des enfants de 12 à 23 mois",
    description:
      "Pourcentage d'enfants de 12 à 23 mois ayant reçu le vaccin contre la rougeole avant 12 mois ou à tout moment avant l'enquête.",
    methodologyNote:
      "Estimations officielles OMS / UNICEF de la couverture vaccinale nationale, via les WDI de la Banque mondiale. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "adult-literacy": {
    name: "Taux d'alphabétisation des adultes",
    shortLabel: "Alphabétisation",
    unit: "% des personnes de 15 ans et plus",
    description:
      "Pourcentage des personnes de 15 ans et plus capables de lire et d'écrire, en le comprenant, un énoncé simple et court relatif à leur vie quotidienne.",
    methodologyNote:
      "Série officielle de l'Institut de statistique de l'UNESCO (UIS), dépositaire de l'indicateur ODD 4.6.2, via les WDI. Beaucoup de pays à revenu élevé ne publient plus de statistiques d'alphabétisation traditionnelles. L'UIS peut combler certains trous avec son modèle documenté GALP. Cette app ne calcule jamais de moyenne mondiale. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "extreme-poverty": {
    name: "Pauvreté extrême",
    shortLabel: "Pauvreté extrême",
    unit: "% de la population sous 3,00 $/jour (PPA 2021)",
    description:
      "Pourcentage de la population vivant avec moins de 3,00 $ par jour en parité de pouvoir d'achat 2021, le seuil international actuel de pauvreté extrême de la Banque mondiale.",
    methodologyNote:
      "Série officielle de la Poverty and Inequality Platform de la Banque mondiale (ODD 1.1.1), via les WDI. Le seuil actuel est 3,00 $/jour en PPA 2021, et non l'ancien seuil de 2,15 $/jour (PPA 2017). Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "top-10-income-share": {
    name: "Part du revenu des 10 % les plus riches",
    shortLabel: "Top 10 % du revenu",
    unit: "% du revenu national avant impôts",
    description:
      "Part du revenu national mondial avant impôts captée par les 10 % d'adultes les plus riches, en partageant le revenu du ménage à parts égales entre conjoints.",
    methodologyNote:
      "Série World Inequality Database sptincj992, percentile p90p100, extraite du fichier World (WO) publié. C'est la distribution interpersonnelle mondiale du revenu national avant impôts parmi les adultes de 20 ans et plus à parts égales — pas un Gini national de la Banque mondiale, et pas SI.DST.10TH.10 des WDI, dont la ligne World est vide. WID publie les parts en fraction 0–1 ; elles sont affichées en pourcent. Les estimations mondiales reconstruites, éparses, antérieures à la série annuelle ne sont pas montrées. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "electricity-access": {
    name: "Accès à l'électricité",
    shortLabel: "Accès à l'électricité",
    unit: "% de la population",
    description:
      "Pourcentage de la population ayant accès à l'électricité.",
    methodologyNote:
      "Série officielle ODD 7.1.1 (électrification) de Tracking SDG7 / ESMAP (Banque mondiale, AIE, IRENA, UNSD, OMS), via les WDI. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "basic-drinking-water": {
    name: "Eau potable de base",
    shortLabel: "Eau potable de base",
    unit: "% de la population",
    description:
      "Pourcentage de la population utilisant au moins des services d'eau potable de base.",
    methodologyNote:
      "Série officielle du Programme conjoint de suivi OMS / UNICEF (JMP) pour l'ODD 6.1, via les WDI. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  undernourishment: {
    name: "Prévalence de la sous-alimentation",
    shortLabel: "Sous-alimentation",
    unit: "% de la population",
    description:
      "Pourcentage de la population dont la consommation alimentaire habituelle est insuffisante pour fournir l'énergie alimentaire nécessaire à une vie normale, active et saine.",
    methodologyNote:
      "Série officielle FAO pour l'ODD 2.1.1, via les WDI de la Banque mondiale. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "co2-total": {
    name: "Émissions de CO₂ (total)",
    shortLabel: "CO₂ total",
    unit: "Mt éq. CO₂, hors UTCATF",
    description:
      "Émissions annuelles de dioxyde de carbone issues de l'agriculture, de l'énergie, des déchets et de l'industrie, hors utilisation des terres, changement d'affectation des terres et foresterie, en millions de tonnes d'équivalent CO₂.",
    methodologyNote:
      "Série gaz à effet de serre actuelle des WDI (EN.GHG.CO2.MT.CE.AR5), issue de la base EDGAR du JRC de la Commission européenne et de l'AIE. C'est le total mondial publié, pas une somme calculée à partir des pays. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "co2-per-capita": {
    name: "Émissions de CO₂ par habitant",
    shortLabel: "CO₂ par habitant",
    unit: "t éq. CO₂ par habitant, hors UTCATF",
    description:
      "Émissions annuelles de dioxyde de carbone hors utilisation des terres, changement d'affectation des terres et foresterie, divisées par la population, en tonnes d'équivalent CO₂ par personne.",
    methodologyNote:
      "Série gaz à effet de serre actuelle des WDI (EN.GHG.CO2.PC.CE.AR5), issue de la base EDGAR du JRC de la Commission européenne et de l'AIE. L'ancien code WDI EN.ATM.CO2E.PC n'est pas utilisé. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  methane: {
    name: "Émissions de méthane (total)",
    shortLabel: "Méthane",
    unit: "Mt éq. CO₂, hors UTCATF",
    description:
      "Émissions annuelles de méthane (CH₄) issues de l'agriculture, de l'énergie, des déchets et de l'industrie, hors utilisation des terres, changement d'affectation des terres et foresterie, en millions de tonnes d'équivalent CO₂.",
    methodologyNote:
      "Série gaz à effet de serre actuelle des WDI (EN.GHG.CH4.MT.CE.AR5), issue de la base EDGAR du JRC de la Commission européenne et de l'AIE. Les valeurs utilisent les potentiels de réchauffement global sur 100 ans du GIEC AR5. C'est le total mondial publié, pas une somme calculée à partir des pays. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "forest-area": {
    name: "Surface forestière",
    shortLabel: "Forêts",
    unit: "% de la superficie terrestre",
    description:
      "Part des terres couvertes de peuplements d'arbres naturels ou plantés d'au moins 5 mètres de haut, productifs ou non. Exclut les arbres des systèmes de production agricole (vergers, agroforesterie) et ceux des parcs et jardins urbains.",
    methodologyNote:
      "Série officielle FAO pour l'ODD 15.1.1, issue de l'Évaluation des ressources forestières mondiales, via les WDI (AG.LND.FRST.ZS). C'est la part mondiale publiée, pas une moyenne calculée à partir des pays. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "renewable-energy": {
    name: "Consommation d'énergies renouvelables",
    shortLabel: "Énergies renouvelables",
    unit: "% de la consommation finale d'énergie",
    description:
      "Part de la consommation finale d'énergie provenant de sources renouvelables, y compris l'hydroélectricité, l'éolien, le solaire, la géothermie et la biomasse.",
    methodologyNote:
      "Série officielle ODD 7.2.1 de Tracking SDG7 (AIE, IRENA, UNSD, Banque mondiale, OMS), via les WDI (EG.FEC.RNEW.ZS). Inclut la biomasse traditionnelle aussi bien que les renouvelables modernes, donc la part mondiale peut baisser pendant que l'éolien et le solaire progressent. Seules les années avec une valeur mondiale publiée sont affichées.",
  },
  "battle-deaths": {
    name: "Décès au combat",
    shortLabel: "Décès au combat",
    unit: "décès",
    description:
      "Nombre de personnes tuées dans des incidents liés aux combats lors de conflits armés impliquant un État : combattants et civils morts directement du fait des combats.",
    methodologyNote:
      "Jeu de données Uppsala Conflict Data Program (UCDP) Battle-Related Deaths, fichier conflit-année (bd_best). La Banque mondiale redistribue cette série sous le code VC.BTL.DETH mais laisse la ligne World vide ; le total mondial est donc pris chez UCDP : somme des estimations « best » de chaque conflit-année (une ligne par conflit et par année, pas de moyenne de pays). Morts directes au combat uniquement — pas la famine, les maladies ou les autres effets indirects de la guerre. Ce n'est pas une part de l'ensemble des décès.",
  },
};

export function localeNumberFormat(locale: Locale) {
  return locale === "fr" ? "fr-FR" : "en-US";
}

export function translatedMetric(
  metric: {
    slug: string;
    name: string;
    shortLabel: string;
    unit: string;
    description: string;
    methodologyNote: string;
  },
  locale: Locale,
): MetricCopy {
  if (locale === "fr") {
    return METRIC_FR[metric.slug] ?? metric;
  }

  return {
    name: metric.name,
    shortLabel: metric.shortLabel,
    unit: metric.unit,
    description: metric.description,
    methodologyNote: metric.methodologyNote,
  };
}
