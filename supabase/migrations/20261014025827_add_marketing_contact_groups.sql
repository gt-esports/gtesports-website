alter table public.marketing_contacts
  add column contact_group text not null default 'newsletter'
  check (contact_group in ('newsletter', 'alumni', 'both'));

alter table public.marketing_contacts drop constraint marketing_contacts_status_check;
update public.marketing_contacts set status = 'active' where status <> 'do_not_contact';
alter table public.marketing_contacts alter column status set default 'active';
alter table public.marketing_contacts add constraint marketing_contacts_status_check
  check (status in ('active', 'unsubscribed', 'do_not_contact'));
