alter table public.leads
  add column if not exists email varchar(255),
  add column if not exists wedding_date date,
  add column if not exists date date,
  add column if not exists preferred_location varchar(255),
  add column if not exists location varchar(255),
  add column if not exists category varchar(255),
  add column if not exists requirement text,
  add column if not exists special_requirement text,
  add column if not exists notes text,
  add column if not exists area varchar(255),
  add column if not exists district varchar(255),
  add column if not exists source varchar(50),
  add column if not exists product_name varchar(255),
  add column if not exists product_image text;

alter table public.enquiries
  add column if not exists email varchar(255),
  add column if not exists wedding_date date,
  add column if not exists preferred_location varchar(255),
  add column if not exists requirement text,
  add column if not exists special_requirement text,
  add column if not exists area varchar(255),
  add column if not exists district varchar(255),
  add column if not exists source varchar(50),
  add column if not exists product_name varchar(255),
  add column if not exists product_image text;
