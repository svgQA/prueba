#!/bin/bash

if git diff-files --quiet; then
    if git ls-files --others --exclude-standard; then
        echo "Success: All files are prepared to commit."
        exit 0
    else
        echo "Error: There are untracked files."
        exit 1
    fi
else
    echo "Error: There are unstaged changes."
    exit 1
fi
