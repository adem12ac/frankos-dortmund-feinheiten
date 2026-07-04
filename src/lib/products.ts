import prsutaVak from "@/assets/prsuta-vak.jpg.asset.json";
import prsutaSlices from "@/assets/prsuta-slices.jpg.asset.json";
import storeShelf from "@/assets/store-shelf.jpg.asset.json";
import hero from "@/assets/frankos-hero.jpg.asset.json";

export type Product = {
  id: string;
  name: string;
  category: string;
  price: string;
  unit: string;
  description: string;
  image: string;
  badge?: string;
};

export const categories = [
  { id: "wurst", label: "Wurst & Trockenfleisch", emoji: "🥩" },
  { id: "eingelegt", label: "Eingelegtes Gemüse", emoji: "🫑" },
  { id: "aufstrich", label: "Aufstriche & Ajvar", emoji: "🍯" },
  { id: "snacks", label: "Snacks & Sonstiges", emoji: "🧂" },
];

export const products: Product[] = [
  {
    id: "suva-goveda-prsuta-vak",
    name: "Suva Goveđa Pršuta",
    category: "wurst",
    price: "8,90 €",
    unit: "ca. 250 g",
    description: "Naturgeräuchertes Rindfleisch aus Montenegro, traditionell luftgetrocknet.",
    image: prsutaVak.url,
    badge: "Bestseller",
  },
  {
    id: "suva-goveda-prsuta-slices",
    name: "Suva Goveđa Pršuta, geschnitten",
    category: "wurst",
    price: "4,90 €",
    unit: "100 g",
    description: "Hauchdünn geschnittenes Rinder-Pršuta – perfekt für die Meze-Platte.",
    image: prsutaSlices.url,
  },
  {
    id: "goveji-sudzuk",
    name: "Goveđi Sudžuk",
    category: "wurst",
    price: "6,50 €",
    unit: "ca. 300 g",
    description: "Würzige Rinderwurst mit Paprika und Knoblauch – ein Balkan-Klassiker.",
    image: storeShelf.url,
  },
  {
    id: "ajvar-scharf",
    name: "Hausgemachter Ajvar (scharf)",
    category: "aufstrich",
    price: "5,90 €",
    unit: "580 ml",
    description: "Aus roter Paprika und Auberginen, langsam eingekocht. Feurig gewürzt.",
    image: hero.url,
    badge: "Neu",
  },
  {
    id: "ajvar-mild",
    name: "Hausgemachter Ajvar (mild)",
    category: "aufstrich",
    price: "5,90 €",
    unit: "580 ml",
    description: "Sanft und samtig – ideal zu Fleisch, Brot oder Käse.",
    image: hero.url,
  },
  {
    id: "eingelegte-paprika",
    name: "Eingelegte Feferoni",
    category: "eingelegt",
    price: "4,50 €",
    unit: "720 ml",
    description: "Knackige, milde Paprika im Sud – klassisch balkanisch eingelegt.",
    image: hero.url,
  },
  {
    id: "gefuellte-paprika",
    name: "Gefüllte Paprika mit Frischkäse",
    category: "eingelegt",
    price: "6,90 €",
    unit: "720 ml",
    description: "Zart gefüllte rote Paprika – ein absoluter Klassiker der Vorspeisenplatte.",
    image: hero.url,
  },
  {
    id: "kornichon",
    name: "Balkan-Gewürzgurken",
    category: "eingelegt",
    price: "3,90 €",
    unit: "720 ml",
    description: "Kräftig gewürzte Gurken – knackig, würzig und frisch.",
    image: hero.url,
  },
  {
    id: "chipsy",
    name: "Frankos Balkan Chips",
    category: "snacks",
    price: "2,50 €",
    unit: "150 g",
    description: "Gewürzte Chips im typischen Balkan-Stil – knackiger Snack für zwischendurch.",
    image: storeShelf.url,
  },
];