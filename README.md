# Handlingslistan

A free to self host list

## TODO

- [x] Responsive navbar with hamburger menu. CSS only.
- [x] Setup database
- [ ] Test deploy, vercel/netlify/docker(?)
- [ ] Cool mainpage with descriptions
- [ ] Implement auth:
  - [ ] Add Google provider
  - [ ] Credentials?
  - [ ] Middleware?
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
  - [ ] Migrate to betterAuth to do credentials without issues

- [ ] Docs
- [ ] Hosting options with open-source API

  **Long-long term:**
  - Tauri or electron app based on the Webb app
  - Mobile? Either Tauri on mobile or something like React Native perhaps. This will be a big project so will definativly take some time.

# Mobile plan:

The current plan is to make a hugo monorepo with a express/tRPC backend with database and betterAuth, expo React native app, and NextJs webapp. Might take some inspiration from t3 monorepo setup and use turborepo even if I will not use the stash on vercel or hosting options. Make sure to do a docker compose to deploy 3 containers. One with database, other with express backend and a third with the nextjs backend. It seems hard to make the real time parts for the lits when hosting with vercel. Might want to make a option to host on vercel, but since that is not my plan to do I probably wont put any energy into it. currently the plan is to make a preliminary list, then migrate to betterAuth. After that I will try to migrate this project to next 16 and express/trpc backend in possibly a seperate repo. There will be so mush changes that I see no point in keeping it in this repo. Hopefully won't take that long until I get a working prototype of it.
