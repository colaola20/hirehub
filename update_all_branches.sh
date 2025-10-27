#!/bin/bash
git fetch --all
for branch in $(git branch -r | grep -v '\->'); do
  local_branch=${branch#origin/}
  echo "Updating branch: $local_branch"
  git checkout $local_branch 2>/dev/null || git checkout -b $local_branch $branch
  git merge $branch
done
