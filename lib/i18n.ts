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
  chapters: Record<
    "survival" | "knowledge" | "living" | "planet",
    { title: string; eyebrow: string }
  >;
  categoryLabels: Record<"survival" | "knowledge" | "living" | "planet", string>;
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
      "Published World aggregates from UN agencies, the World Bank, WHO, UNESCO, FAO, and the European Commission JRC.",
    scrubberLabel: "Official World estimates",
    scrubberHint:
      "A tile shows a number only if the producer published a World value for that year.",
    thenVs: (year) => `Then vs ${year}`,
    thenVsHint:
      "First official World point compared with the selected year. No estimate means the producer did not publish a World value.",
    noEstimate: "No official estimate",
    better: "Better",
    worse: "Worse",
    unchanged: "Unchanged",
    vs: "vs",
    openSeries: "Open series →",
    lastIngested: (date) => `Last ingested ${date}.`,
    accessChannel: "Access channel: World Bank WDI, country code WLD.",
    droppedCandidates: (count) =>
      `${count} candidate${count === 1 ? "" : "s"} dropped for lack of a World series.`,
    allShipped: (count) =>
      `All ${count} candidates had a published World series.`,
    seeSources: "See sources",
    chapters: {
      survival: { title: "Survival", eyebrow: "Health and longevity" },
      knowledge: { title: "Knowledge", eyebrow: "Literacy" },
      living: {
        title: "Living standards",
        eyebrow: "Poverty, energy, water, food",
      },
      planet: { title: "Planet", eyebrow: "Emissions" },
    },
    categoryLabels: {
      survival: "Survival",
      knowledge: "Knowledge",
      living: "Living standards",
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
      wdiCode: "WDI code",
      license: "License",
      fetched: "Fetched",
      wdiLink: "World Bank indicator",
      producerLink: "Producer homepage",
    },
    sourcesPage: {
      eyebrow: "Provenance",
      title: "Sources",
      lead: "Every number on this site is a published World aggregate. The app never averages country rows, never interpolates missing years, and never keeps a series with zero World points.",
      access: (date) =>
        `Access channel: World Bank World Development Indicators API, country code WLD, license CC BY 4.0. Last ingest ${date}.`,
      colMetric: "Metric",
      colProducer: "Producer",
      colCode: "WDI code",
      colPoints: "Points",
      colLicense: "License",
      colLinks: "Links",
      producerLink: "Producer",
      droppedTitle: "Dropped candidates",
      droppedLead:
        "These codes were requested and not shipped because WDI returned no non-null World values.",
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
      "Agrégats mondiaux publiés par les agences de l'ONU, la Banque mondiale, l'OMS, l'UNESCO, la FAO et le JRC de la Commission européenne.",
    scrubberLabel: "Estimations mondiales officielles",
    scrubberHint:
      "Une tuile n'affiche un chiffre que si le producteur a publié une valeur mondiale pour cette année.",
    thenVs: (year) => `Alors vs ${year}`,
    thenVsHint:
      "Premier point mondial officiel comparé à l'année sélectionnée. Pas d'estimation signifie que le producteur n'a pas publié de valeur mondiale.",
    noEstimate: "Pas d'estimation officielle",
    better: "Mieux",
    worse: "Moins bien",
    unchanged: "Stable",
    vs: "vs",
    openSeries: "Voir la série →",
    lastIngested: (date) => `Dernier ingest ${date}.`,
    accessChannel:
      "Canal d'accès : WDI Banque mondiale, code pays WLD.",
    droppedCandidates: (count) =>
      `${count} candidat${count === 1 ? "" : "s"} écarté${count === 1 ? "" : "s"} faute de série mondiale.`,
    allShipped: (count) =>
      `Les ${count} candidats avaient une série mondiale publiée.`,
    seeSources: "Voir les sources",
    chapters: {
      survival: { title: "Survie", eyebrow: "Santé et longévité" },
      knowledge: { title: "Savoir", eyebrow: "Alphabétisation" },
      living: {
        title: "Niveau de vie",
        eyebrow: "Pauvreté, énergie, eau, alimentation",
      },
      planet: { title: "Planète", eyebrow: "Émissions" },
    },
    categoryLabels: {
      survival: "Survie",
      knowledge: "Savoir",
      living: "Niveau de vie",
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
      wdiCode: "Code WDI",
      license: "Licence",
      fetched: "Récupéré le",
      wdiLink: "Indicateur Banque mondiale",
      producerLink: "Site du producteur",
    },
    sourcesPage: {
      eyebrow: "Provenance",
      title: "Sources",
      lead: "Chaque chiffre de ce site est un agrégat mondial publié. L'app ne calcule jamais de moyenne à partir des pays, n'interpole jamais les années manquantes, et ne conserve jamais une série sans point mondial.",
      access: (date) =>
        `Canal d'accès : API World Development Indicators de la Banque mondiale, code pays WLD, licence CC BY 4.0. Dernier ingest ${date}.`,
      colMetric: "Métrique",
      colProducer: "Producteur",
      colCode: "Code WDI",
      colPoints: "Points",
      colLicense: "Licence",
      colLinks: "Liens",
      producerLink: "Producteur",
      droppedTitle: "Candidats écartés",
      droppedLead:
        "Ces codes ont été demandés et n'ont pas été publiés, car WDI n'a renvoyé aucune valeur mondiale non nulle.",
    },
    notFound: {
      title: "Introuvable",
      body: "Cette page ne fait pas partie des séries mondiales publiées.",
      back: "Retour à la vue mondiale",
    },
  },
};

export const METRIC_FR: Record<string, MetricCopy> = {
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
