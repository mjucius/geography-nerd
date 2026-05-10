# Privacy

Geography Nerd does not create accounts, collect emails, persist quiz answers, store quiz sessions, or include app-level analytics or advertising.

Local mode runs the game from bundled city data. Hosted Supabase mode only reads public city and country records.

External services may still receive normal technical request data when used:

- Your static web host receives page requests.
- Supabase receives public city-data read requests when hosted Supabase mode is enabled.
- CARTO/OpenStreetMap-related tile services receive map tile requests when maps are displayed.

The app does not add cookies or browser localStorage for gameplay.
