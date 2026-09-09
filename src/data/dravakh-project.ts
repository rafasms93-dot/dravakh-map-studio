export interface DravakhProvinceDefinition {
  id: string;
  name: string;
  category: string;
  house: string;
  macroPosition: string;
  primaryLandmark: string;
}

export const DRAVAKH_PROJECT = {
  internalProjectName: "Nova Valyria OS",
  gameName: "Dravakh: House of Habits",
  defaultKingdomName: "Dravakh",
  publicNamingRule: "Nova Valyria must never be shown to the player",
  mapStudioName: "Dravakh Map Studio"
} as const;

export const DRAVAKH_PROVINCES: readonly DravakhProvinceDefinition[] = [
  {
    id: "rivermend",
    name: "Rivermend",
    category: "Hidratação",
    house: "House Rhyven",
    macroPosition: "centro-sul hidrográfico",
    primaryLandmark: "Castelo de Rhyven"
  },
  {
    id: "harvest-hall",
    name: "Harvest Hall",
    category: "Nutrição",
    house: "House Goldmere",
    macroPosition: "oeste/sudoeste agrícola",
    primaryLandmark: "Salão de Goldmere"
  },
  {
    id: "dreamrest",
    name: "Dreamrest",
    category: "Sono",
    house: "House Velmora",
    macroPosition: "noroeste",
    primaryLandmark: "Cidadela de Velmora"
  },
  {
    id: "ironforge-reaches",
    name: "Ironforge Reaches",
    category: "Exercício Físico",
    house: "House Mordrake",
    macroPosition: "centro-leste vulcânico",
    primaryLandmark: "Forja de Mordrake"
  },
  {
    id: "white-keep",
    name: "White Keep",
    category: "Higiene",
    house: "House Vaelmont",
    macroPosition: "nordeste costeiro/glacial",
    primaryLandmark: "Fortaleza Branca"
  },
  {
    id: "sanctum-crest",
    name: "Sanctum Crest",
    category: "Saúde",
    house: "House Asterion",
    macroPosition: "norte central montanhoso",
    primaryLandmark: "Sanctum de Asterion"
  },
  {
    id: "citadel-reach",
    name: "Citadel Reach",
    category: "Conhecimento",
    house: "House Caelith",
    macroPosition: "costa oeste",
    primaryLandmark: "Cidadela de Caelith"
  },
  {
    id: "kings-road",
    name: "King's Road",
    category: "Carreira",
    house: "House Valeron",
    macroPosition: "eixo longitudinal central",
    primaryLandmark: "Centro administrativo da Estrada Real"
  },
  {
    id: "swiftstride-pass",
    name: "Swiftstride Pass",
    category: "Produtividade",
    house: "House Veyrad",
    macroPosition: "corredor territorial central",
    primaryLandmark: "Fortim de passagem"
  },
  {
    id: "hearthkeep",
    name: "Hearthkeep",
    category: "Organização",
    house: "Casa do Soberano",
    macroPosition: "núcleo político central",
    primaryLandmark: "Fortaleza da Coroa"
  },
  {
    id: "soldiers-wall",
    name: "Soldier's Wall",
    category: "Disciplina",
    house: "House Dravorn",
    macroPosition: "gargalo abaixo do Norte",
    primaryLandmark: "Grande Muralha"
  },
  {
    id: "alliance-high",
    name: "Alliance High",
    category: "Relações",
    house: "House Aerenth",
    macroPosition: "leste/sudeste elevado",
    primaryLandmark: "Palácio de Aerenth"
  },
  {
    id: "highhallow",
    name: "Highhallow",
    category: "Espiritualidade",
    house: "House Elyrion",
    macroPosition: "domínio insular a leste",
    primaryLandmark: "Templo-Fortaleza de Elyrion"
  },
  {
    id: "highfest-haven",
    name: "Highfest Haven",
    category: "Lazer",
    house: "House Merraval",
    macroPosition: "sudeste costeiro",
    primaryLandmark: "Porto de Merraval"
  },
  {
    id: "ironbank-ridge",
    name: "Ironbank Ridge",
    category: "Finanças",
    house: "House Ferrane",
    macroPosition: "extremo sudoeste montanhoso",
    primaryLandmark: "Fortaleza-Cofre Ferrane"
  }
] as const;
