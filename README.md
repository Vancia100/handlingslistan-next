# Handlingslistan

A turborepo implementation of handlingslistan. Currently in early state, and does have some issues. On top of moving to a separe backend the auth is also moved to BetterAuth. None of the endpoints have been moved to TRPC.

## TODO

### Monorepo:

- [ ] Migrate to TRPC where it makes sense.
- [x] Make sure that Linting works.
- [ ] Formatting works
- [ ] Propper environment variable management
- [ ] Remove hard coded localhost to build stuff

### Old stuff:

- [x] Responsive navbar with hamburger menu. CSS only.
- [x] Setup database
- [ ] Cool mainpage with descriptions
- [ ] Implement auth:
  - [ ] Add Google provider
  - [x] Add discord provider
  - [ ] Fix delete account
  - [x] Credentials
  - [ ] Middleware
  - [ ] Make auth page look a litter nicer
- [ ] Profile page:
  - [ ] Edit options saved on account basis
  - [ ] Changeable name and pfp etc
- [ ] Start Webb app:
  - [x] Recipes started
  - [x] Save form state localy in indexDB or localstorage

    _There is currently a system in place that indexes all draft recipes. Could implement a promt for wich one the user would like to load instad of just loading the one previously used._
    - [ ] _Choice of local drafts_
    - [ ] Make sure that the status update screen does not block the back button

  - [x] My Recipes on main page
  - [x] Public and private recipes
  - [x] Search for recipes
  - [x] Add people that can view a recipe
  - [ ] Propper back button navigation strategy
  - [ ] Improve looks of "card" component
  - [ ] Better search options?
  - [ ] Make the webapp not look like ass on phones
  - [ ] Create a list and save it to database
  - [ ] Recipe to list interaction
  - [ ] Go shoping, things left in list gets put inte new list, data saved ...
  - [ ] Have shoping lists sync with multiple users
  - [x] Migrate to betterAuth to do credentials without issues

- [ ] Docs
- [ ] Hosting options withopen-source API

**Long-long term:**

- [ ] Expo + React Native app in monorepo
