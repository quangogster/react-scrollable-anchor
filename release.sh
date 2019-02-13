#!/bin/bash
set -o errexit
set -o nounset

# install deps & do build
npm install
npm run prepublish

# move compile result out
npm run clean-src
cp -r ./lib/* ./
mv -f .gitignore_for_release .gitignore

# remove lib folder
rm -rf ./lib

# commit & push
git add --all .
git commit -m "build"
tagName="v$(jq '.version' package.json | sed "s/\"//g")"
git tag -a $tagName -m "built by travis"
git push origin $tagName
