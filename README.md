# wp-starter-vueify
Starter wordpress theme stack with Gulp, Browserify, Vueify and optimized rest API support, created and used by Ks Studio

## Setup

1. Install [ WP-Rest-APi](https://fr.wordpress.org/plugins/rest-api/) to your wordpress site.
2. Create a new directory in your wordpress themes folder
3. Download the package and copy to this directory
4. Change package.json informations(name,themes_infos,etc...) !!! important: Files headers and theme declarations will use informations you provided.
4. Run npm install
5. Run gulp wp to create Wordpress needed files
6. Run gulp to create needed assets files

## Usage

Run `gulp` to build css and js files

Run `gulp build` to build and clean final theme. It will output generated theme to /dist folder, and create a zip file.