# Migrations

The current migration creates the optional hosted read-only city database:

- `countries`
- `cities`
- public read policies for both tables

It does not create authentication, profiles, quiz sessions, quiz responses, user progress, or analytics tables.

For fresh projects, apply `20260502000001_public_city_schema.sql`, then run `../cities-import.sql`.
