#!bash
cd "$(dirname "$0")"
REPO_ROOT="$(git rev-parse --show-toplevel)"
# copy everything, replacing the contents of the destination directory
# ~/Developer/react/build/oss-stable-semver/react-client into packages/react-client
# ~/Developer/react/build/oss-stable-semver/react-server into packages/react-server
# ~/Developer/react/build/oss-stable-semver/react-server-dom-* into ~/Developer/react/build/oss-stable-semver/react-server-dom-*

# first, set up some variables
sourceDir="$HOME/Developer/react/build/oss-stable-semver"
destDir="$REPO_ROOT/packages"
packageNames=("react-client" "react-server" "react-server-dom-esm" "react-server-dom-turbopack" "react-server-dom-webpack")

# functions

copyFiles(){
    local packageName=$1
    local sourcePath="$sourceDir/$packageName"
    local destPath="$destDir/$packageName"
    echo "Copying $sourcePath to $destPath"
    if [ -d "$destPath" ]; then
        mv "$destPath" "$destPath.bak.$(date +%s)"
    fi
    cp -r "$sourcePath" "$destPath"
}

copyEach(){
    for packageName in "${packageNames[@]}"; do
        copyFiles "$packageName"
        echo
    done
}

verifyGitClean(){
    if [ -n "$(git status --porcelain)" ]; then
        echo
        echo "ERROR: git working directory is not clean. Please commit or stash your changes."
        exit 1
    fi
}

# main

verifyGitClean
copyEach
