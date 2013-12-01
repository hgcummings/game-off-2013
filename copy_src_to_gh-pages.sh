cp -r src/ ../tempSrc
git checkout gh-pages
cp -r ../tempSrc/* ./
rm -rf ../tempSrc
git add -A
git reset HEAD copy_src_to_gh-pages.sh
git status