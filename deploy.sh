npm run build
git add .
git commit -m "deploy"
git push
git subtree push --prefix dist origin gh-pages