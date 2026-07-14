-- =============================================================
-- Frankos Balkan Food — Startsortiment (Seed)
-- Nach schema.sql im Supabase SQL Editor ausführen.
-- Bild-URLs anschließend im Admin-Dashboard pflegen.
-- =============================================================

insert into public.products
  (handle, title, description, category, price_cents, unit, badge, stock, active)
values
  ('suva-goveda-prsuta-vak', 'Suva Goveđa Pršuta',
   'Naturgeräuchertes Rindfleisch aus Montenegro, traditionell luftgetrocknet.',
   'Wurst & Trockenfleisch', 890, 'ca. 250 g', 'Bestseller', 25, true),

  ('suva-goveda-prsuta-slices', 'Suva Goveđa Pršuta, geschnitten',
   'Hauchdünn geschnittenes Rinder-Pršuta – perfekt für die Meze-Platte.',
   'Wurst & Trockenfleisch', 490, '100 g', null, 30, true),

  ('goveji-sudzuk', 'Goveđi Sudžuk',
   'Würzige Rinderwurst mit Paprika und Knoblauch – ein Balkan-Klassiker.',
   'Wurst & Trockenfleisch', 650, 'ca. 300 g', null, 20, true),

  ('ajvar-scharf', 'Hausgemachter Ajvar (scharf)',
   'Aus roter Paprika und Auberginen, langsam eingekocht. Feurig gewürzt.',
   'Aufstriche & Ajvar', 590, '580 ml', 'Neu', 40, true),

  ('ajvar-mild', 'Hausgemachter Ajvar (mild)',
   'Sanft und samtig – ideal zu Fleisch, Brot oder Käse.',
   'Aufstriche & Ajvar', 590, '580 ml', null, 40, true),

  ('eingelegte-paprika', 'Eingelegte Feferoni',
   'Knackige, milde Paprika im Sud – klassisch balkanisch eingelegt.',
   'Eingelegtes Gemüse', 450, '720 ml', null, 35, true),

  ('gefuellte-paprika', 'Gefüllte Paprika mit Frischkäse',
   'Zart gefüllte rote Paprika – ein absoluter Klassiker der Vorspeisenplatte.',
   'Eingelegtes Gemüse', 690, '720 ml', null, 25, true),

  ('kornichon', 'Balkan-Gewürzgurken',
   'Kräftig gewürzte Gurken – knackig, würzig und frisch.',
   'Eingelegtes Gemüse', 390, '720 ml', null, 35, true),

  ('chipsy', 'Frankos Balkan Chips',
   'Gewürzte Chips im typischen Balkan-Stil – knackiger Snack für zwischendurch.',
   'Snacks & Sonstiges', 250, '150 g', null, 60, true)
on conflict (handle) do nothing;
