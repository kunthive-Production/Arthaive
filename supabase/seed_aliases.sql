-- Seed known investor aliases so entity resolution works from day one
-- These cover the most common name variants seen in Indian startup news

insert into investor_aliases (investor_name, alias_name) values
  -- Peak XV (formerly Sequoia India)
  ('Peak XV Partners', 'Sequoia Capital India'),
  ('Peak XV Partners', 'Sequoia India'),
  ('Peak XV Partners', 'Peak XV'),
  ('Peak XV Partners', 'Sequoia Capital India Advisors'),

  -- Matrix Partners India
  ('Matrix Partners India', 'Matrix India'),
  ('Matrix Partners India', 'Z47'),
  ('Matrix Partners India', 'Matrix Partners'),

  -- Accel India
  ('Accel India', 'Accel Partners India'),
  ('Accel India', 'Accel'),

  -- Kalaari Capital
  ('Kalaari Capital', 'Kalaari'),

  -- Blume Ventures
  ('Blume Ventures', 'Blume'),

  -- Chiratae Ventures
  ('Chiratae Ventures', 'IDG Ventures India'),
  ('Chiratae Ventures', 'Chiratae'),

  -- Nexus Venture Partners
  ('Nexus Venture Partners', 'Nexus VP'),
  ('Nexus Venture Partners', 'Nexus Ventures'),

  -- Tiger Global
  ('Tiger Global Management', 'Tiger Global'),
  ('Tiger Global Management', 'Tiger Global Management LLC'),

  -- SoftBank
  ('SoftBank Vision Fund', 'SoftBank'),
  ('SoftBank Vision Fund', 'Softbank Group'),
  ('SoftBank Vision Fund', 'SoftBank Vision Fund 2'),

  -- Lightspeed India
  ('Lightspeed India Partners', 'Lightspeed India'),
  ('Lightspeed India Partners', 'Lightspeed Venture Partners India'),

  -- 3one4 Capital
  ('3one4 Capital', '3One4 Capital'),
  ('3one4 Capital', '3one4'),

  -- Stellaris Venture Partners
  ('Stellaris Venture Partners', 'Stellaris VP'),
  ('Stellaris Venture Partners', 'Stellaris'),

  -- Elevation Capital
  ('Elevation Capital', 'SAIF Partners'),
  ('Elevation Capital', 'SAIF India'),
  ('Elevation Capital', 'Elevation'),

  -- India Quotient
  ('India Quotient', 'IndiaQuotient'),

  -- Waterbridge Ventures
  ('Waterbridge Ventures', 'WaterBridge Ventures'),

  -- General Atlantic
  ('General Atlantic', 'GA'),

  -- Prosus Ventures
  ('Prosus Ventures', 'Naspers Ventures'),
  ('Prosus Ventures', 'Prosus')

on conflict (alias_name) do nothing;


-- Seed known startup aliases for common rebrand / spelling variants
insert into startup_aliases (company, alias_name, alias_type) values
  ('BharatPe', 'Bharat Pay', 'alternate_spelling'),
  ('BharatPe', 'Bharat Pe', 'alternate_spelling'),
  ('Ola Cabs', 'Ola', 'short_name'),
  ('Ola Cabs', 'ANI Technologies', 'former_name'),
  ('Dunzo', 'Dunzo Digital', 'alternate_spelling'),
  ('CRED', 'Dreamplug Technologies', 'former_name'),
  ('Meesho', 'Fashnear Technologies', 'former_name'),
  ('Razorpay', 'Razorpay Software', 'alternate_spelling'),
  ('Zepto', 'KiranaKart', 'former_name'),
  ('Groww', 'Nextbillion Technology', 'former_name'),
  ('Slice', 'Slicepay', 'former_name'),
  ('Jupiter', 'Amica Financial Technologies', 'former_name'),
  ('Navi Technologies', 'Navi', 'short_name'),
  ('PhonePe', 'Phone Pe', 'alternate_spelling'),
  ('ShareChat', 'Mohalla Tech', 'alternate_spelling'),
  ('Paytm', 'One97 Communications', 'former_name'),
  ('Paytm', 'One 97 Communications', 'alternate_spelling'),
  ('Flipkart', 'Flipkart Internet', 'alternate_spelling'),
  ('InMobi', 'In Mobi', 'alternate_spelling'),
  ('PolicyBazaar', 'PB Fintech', 'alternate_spelling'),
  ('CarDekho', 'Girnar Software', 'former_name')

on conflict (alias_name) do nothing;
