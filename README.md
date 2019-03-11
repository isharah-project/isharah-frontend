# egsl-website-frontend

> front end for EgSL website

## Dev Setup
install [yarn package manager](https://yarnpkg.com/lang/en/docs/install/)

``` bash
# install dependencies
$ yarn install
```

create `.env` file in the root with the corresponding env vars
```
API_ENDPOINT=https://api.example.com
```

``` bash
# run with hot reload at localhost:4567
$ yarn run dev
```

## Build

```bash
# build for production and launch server
$ yarn run build
$ yarn start

# generate static project
$ yarn run generate
```

For detailed explanation on how things work, checkout [Nuxt.js docs](https://nuxtjs.org).
