#!/usr/bin/env bash
cd "$(dirname "$0")"
REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

# first, set up some variables
reactDir="$HOME/Developer/react"
buildDir="$HOME/Developer/react/build/oss-stable-semver"
destDir="$REPO_ROOT/packages/@double-observer"
packageNames=("react-client" "react-server" "react-server-dom-esm")
buildNames=("react-server/flight" "react-client/flight" "react-server-dom-esm")


# functions

build(){
    cd "$reactDir"
    if [ -d "build" ]; then
        mv build build.bak.$(date +%s)
    fi

    # yarn build --help
    # $ node ./scripts/rollup/build-all-release-channels.js --help
    # Options:
    #   --help                Show help                           [boolean]
    #   --version             Show version number                 [boolean]
    #   --releaseChannel, -r  Build the given release channel.    [string] [choices: "experimental", "stable"]
    #   --index, -i           Worker id.                          [number]
    #   --total, -t           Total number of workers.            [number]
    #   --ci                  Run tests in CI                     [boolean] [default: false]
    #   --type                Build the given bundle type.
    #                         (NODE_ES2015,ESM_DEV,ESM_PROD,NODE_DEV,NODE_PROD,NODE_PROFILING,BUN_DEV,BUN_PROD,FB_WWW_DEV,FB_WWW_PROD,FB_WWW_PROFILING,RN_OSS_DEV,RN_OSS_PROD,RN_OSS_PROFILING,RN_FB_DEV,RN_FB_PROD,RN_FB_PROFILING,BROWSER_SCRIPT)   [string]
    #   --pretty              Force pretty output.                [boolean]
    #   --sync-fbsource       Include to sync build to fbsource.  [string]
    #   --sync-www            Include to sync build to www.       [string]
    #   --unsafe-partial      Do not clean ./build first.         [boolean]

    yarn build "$(IFS=,; echo "${buildNames[*]}")" --total=8 --releaseChannel=stable --type=ESM_DEV,ESM_PROD,NODE_DEV,NODE_PROD,BUN_DEV,BUN_PROD,RN_OSS_DEV,RN_OSS_PROD,BROWSER_SCRIPT
}

copyFiles(){
    local packageName=$1
    local sourcePath="$buildDir/$packageName"
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

# verifyGitClean
build
copyEach
