-- Bulk import of Kyle's real case study reference sheet (35 new + enriches
-- the 3 already in the catalog with industry/service categories). This is
-- what makes the industry/service filters in the proposal editor actually
-- useful — with only 3 uncategorized case studies, any specific filter
-- selection returned zero results, which is why filtering looked broken.
-- No case_study_url values were available in the source sheet; left blank
-- for Kyle to fill in per case study as write-ups go live.

insert into case_studies (industry_label, industry_category, service_category, stat_number, stat_label, company_note, sort_order, active, case_study_url) values
  ('Oilfield Services & Equipment Rentals', 'Business Services', '', '385%', 'Increase in website traffic', 'Diamond T Services · 41 first-page rankings', 100 + 0, true, ''),
  ('Dental & Healthcare', 'Dental', 'PPC', '62.2%', 'Increase in quarterly bookings', 'Dental practice · 93% click-to-conversion rate', 100 + 1, true, ''),
  ('Accessories & Handbags E-Commerce', 'E-Commerce', '', '700%', 'Increase in website traffic', 'Heritage Gear · 87 orders in first month', 100 + 2, true, ''),
  ('Tax Services & Preparation', 'Business Services', '', '912%', 'Increase in organic traffic', 'Denver Tax Advisors · Leads up 665%', 100 + 3, true, ''),
  ('Fast Food Franchise', 'Franchise', 'PPC', '1,259%', 'Increase in ad clicks', 'Checker''s & Rally''s · 5,423% increase in conversions', 100 + 4, true, ''),
  ('Restaurant Franchise', 'Franchise', 'PPC', '2,900%', 'Increase in monthly organic traffic', 'Quiznos · 900% increase in monthly conversions', 100 + 5, true, ''),
  ('Interior & Exterior Painting', 'Home Services', '', '2,742', 'Conversions generated in one year', 'Colorado Painting · 50+ first-page rankings', 100 + 6, true, ''),
  ('Landscaping & Sprinklers', 'Home Services', '', '964%', 'Increase in website traffic', 'Colorado Sprinkler Service · 206 leads in one month', 100 + 7, true, ''),
  ('Landscaping & Sprinklers', 'Home Services', '', '71%', 'Increase in website traffic', 'Omni Sprinklers · 1,573 organic leads generated', 100 + 8, true, ''),
  ('Concrete Leveling', 'Home Services', '', '167', 'Qualified leads generated in 6 months', 'CreteJack · 125% increase in traffic', 100 + 9, true, ''),
  ('Pest Control Services', 'Home Services', 'PPC', '59%', 'Reduction in cost per lead', 'Lincoln Pest Control · 566% increase in monthly lead volume', 100 + 10, true, ''),
  ('HVAC', 'Home Services', 'PPC', '4x', 'Higher conversion rate', 'Tobin HVAC · 99 new backlinks acquired', 100 + 11, true, ''),
  ('Moving & Storage', 'Home Services', '', '297', 'Net-new organic leads generated', 'Checkmate Moving & Storage · 156% traffic increase', 100 + 12, true, ''),
  ('IT Education & Cloud Services', 'Business Services', '', '166%', 'Increase in monthly organic traffic', 'Ascend Education · 250+ organic conversions', 100 + 13, true, ''),
  ('IT Managed Services', 'Business Services', '', '181', 'Organic conversions generated', 'Arctic IT · 33-position ranking increase', 100 + 14, true, ''),
  ('IT Support & Cyber Security', 'Business Services', '', '30%', 'Increase in website traffic', 'IT support company · 15 qualified leads per month', 100 + 15, true, ''),
  ('Managed IT Services', 'Business Services', 'PPC', '136', 'Highly qualified B2B leads generated', 'Managed IT provider · 122% surge in referral traffic', 100 + 16, true, ''),
  ('Personal Injury Law', 'Law Firm', '', '60%', 'Increase in monthly website visits', 'Lampert & Walsh · 42 phone calls in one month', 100 + 17, true, ''),
  ('Aerospace & Defense Manufacturing', 'Aerospace', '', '33%', 'Increase in monthly traffic', 'Intrex Aerospace · 60 form submissions, 66 calls', 100 + 18, true, ''),
  ('Med Spa', 'Med Spa', '', '400%', 'Increase in monthly organic traffic', 'Essex Medspa · 22 dominant local rankings', 100 + 19, true, ''),
  ('Med Spa', 'Med Spa', '', '5,200+', 'Impressions generated', 'Purity Skin Studio · 9.1% conversion rate', 100 + 20, true, ''),
  ('Med Spa', 'Med Spa', '', '354%', 'Increase in monthly organic traffic', 'Laguna Med Spa · 173% increase in conversions', 100 + 21, true, ''),
  ('Functional Medicine & Chiropractic', 'Healthcare', '', '150%', 'Increase in monthly organic traffic', 'Integrated Health Systems · 181 organic conversions', 100 + 22, true, ''),
  ('Physical Therapy', 'Healthcare', '', '7,859', 'Organic sessions generated', 'Sage Physical Therapy · 148 inbound organic calls', 100 + 23, true, ''),
  ('Non-Profit Health Advocacy', 'Non-Profit', '', '166%', 'Increase in monthly organic traffic', 'Conquering CHD · 1,000+ conversions', 100 + 24, true, ''),
  ('Golf Instruction', 'Small Business', '', '40%+', 'YoY organic traffic growth', 'Golf instruction academy · 82 keywords in positions #1-3', 100 + 25, true, ''),
  ('Professional Photography', 'Small Business', '', '237', 'Position ranking increase', 'Kelly Weaver Photography · 30 leads per month average', 100 + 26, true, ''),
  ('New Home Sales', 'Small Business', '', '42%', 'Increase in organic traffic', 'New Home Star · Domain rank +14', 100 + 27, true, ''),
  ('Digital Marketing Agency', 'Small Business', '', '2,400%', 'Growth in ranking keywords', 'Hyve Marketing · 103% increase in organic events', 100 + 28, true, ''),
  ('Boat & Watercraft Rentals', 'Travel', '', '600%', 'Increase in website traffic', 'Voyagers Boat Rentals · 400 phone calls per month', 100 + 29, true, ''),
  ('Raft & Kayak Rentals', 'Travel', '', '800%', 'Increase in website traffic', 'Lazy Dayraft · 1,100 phone calls per month', 100 + 30, true, ''),
  ('Airport Transportation', 'Travel', '', '>1000%', 'Increase in website traffic', 'Denver''s Airport Transportation · 74 leads per month average', 100 + 31, true, ''),
  ('Luxury Vacation Rentals', 'Travel', '', '300%', 'Increase in monthly organic site visits', 'Luxury Fiji vacation company · 5x increase in monthly leads', 100 + 32, true, ''),
  ('Boat Sales & Rentals', 'Travel', '', '600%', 'Increase in website traffic', 'Kiki Catamarans · 25 leads in one month', 100 + 33, true, ''),
  ('Golf Travel & Coaching', 'Travel', '', '100%+', 'Increase in monthly organic site visits', 'Bird Golf · 10x increase in monthly leads', 100 + 34, true, '');

update case_studies set industry_category = 'Home Services', service_category = '' where company_note ilike '%JDI Windows%';
update case_studies set industry_category = 'Home Services', service_category = '' where company_note ilike '%Truss Interiors%';
update case_studies set industry_category = 'Business Services', service_category = 'PPC' where company_note ilike '%Mobile Pet Grooming%';
