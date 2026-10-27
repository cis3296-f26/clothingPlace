select 'table' as kind, table_name as name from information_schema.tables where table_schema = 'public'
union all
select 'trigger', tgname from pg_trigger where tgname = 'on_auth_user_created'
union all
select 'index', indexname from pg_indexes where schemaname = 'public' and indexname not like '%pkey' and indexname not like '%key'
order by 1, 2;