#!/usr/bin/env bash

set -euo pipefail

# Exit codes
readonly EXIT_OK=0
readonly EXIT_WARN=1
readonly EXIT_ERROR=2

# Global flag for quiet mode
QUIET=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --quiet)
            QUIET=true
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Log function that respects quiet mode
log() {
    local level=$1
    local message=$2

    if [ "$QUIET" = "true" ]; then
        # Only show errors and warnings in quiet mode
        if [ "$level" = "ERROR" ] || [ "$level" = "WARN" ]; then
            echo "$message" >&2
        fi
    else
        echo "$message"
    fi
}

# Modified error handler
error_handler() {
    local error_code=$?
    local line_number=$1
    log "ERROR" "🚫 Error occurred in line ${line_number} with exit code ${error_code}"
    log "ERROR" "🥺 Script doesn't know how to continue"
    exit $EXIT_ERROR
}

trap 'error_handler ${LINENO}' ERR

# Version comparison function
version_compare() {
    local version1=$1
    local version2=$2

    # Extract only numbers and dots, removing any other characters
    version1=$(echo "$version1" | grep -o '[0-9.]*' | head -1)
    version2=$(echo "$version2" | grep -o '[0-9.]*' | head -1)

    if [[ "$version1" == "$version2" ]]; then
        return 0
    fi

    local IFS=.
    local i ver1=($version1) ver2=($version2)

    # Fill empty positions in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    # Fill empty positions in ver2 with zeros
    for ((i=${#ver2[@]}; i<${#ver1[@]}; i++)); do
        ver2[i]=0
    done

    # Return 0 if version1 >= version2
    for ((i=0; i<${#ver1[@]}; i++)); do
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 0
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 1
        fi
    done
    return 0
}

load_requirements() {
    if [ ! -f package.json ]; then
        log "ERROR" "🚫 package.json not found"
        log "ERROR" "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    fi

    if ! command -v jq >/dev/null 2>&1; then
        log "ERROR" "🚫 jq is required to parse package.json"
        log "ERROR" "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    fi

    TOOLS=$(jq -r '.config.tools.required' package.json)
}

get_tool_prop() {
    local tool=$1
    local prop=$2
    local default=${3:-null}
    local value
    value=$(echo "$TOOLS" | jq -r ".[\"$tool\"][\"$prop\"] // \"$default\"")
    if [ "$value" = "null" ]; then
        echo "$default"
    else
        echo "$value"
    fi
}

get_tool_commands() {
    local tool=$1
    local commands
    commands=$(echo "$TOOLS" | jq -r ".[\"$tool\"].command | if type == \"array\" then .[] else . // \"$tool\" end")
    if [ -z "$commands" ]; then
        echo "$tool"
    else
        echo "$commands"
    fi
}

extract_version() {
    local version_string=$1
    echo "$version_string" | grep -o '[0-9][0-9.]*' | head -1
}

check_command() {
    local tool=$1
    local command=$2
    local is_critical=${3:-true}
    local required_version=$(get_tool_prop "$tool" "version")

    log "INFO" "🔍 checking for ${tool} (${command}) ..."

    if ! command -v "$command" >/dev/null 2>&1; then
        if [ "${is_critical}" = "true" ]; then
            log "ERROR" "🚫 ${command} is not installed"
            return $EXIT_ERROR
        else
            log "WARN" "⚠️ ${command} is not installed (some features may not work as expected)"
            return $EXIT_WARN
        fi
    fi

    local version_output
    version_output=$(${command} --version 2>&1 || ${command} -v 2>&1 || echo "version not available")
    local installed_version=$(extract_version "$version_output")

    if [ -n "$required_version" ] && [ -n "$installed_version" ]; then
        if ! version_compare "$installed_version" "$required_version"; then
            if [ "${is_critical}" = "true" ]; then
                log "ERROR" "🚫 ${command} version ${installed_version} is older than required version ${required_version}"
                return $EXIT_ERROR
            else
                log "WARN" "⚠️ ${command} version ${installed_version} is older than required version ${required_version}"
                return $EXIT_WARN
            fi
        fi
    fi

    log "INFO" "✅ found ${command} version ${version_output}"
    return $EXIT_OK
}

check_tool() {
    local tool=$1
    local is_critical=$(get_tool_prop "$tool" "critical" "false")
    local exit_status=$EXIT_OK

    while IFS= read -r command; do
        if ! check_command "$tool" "$command" "$is_critical"; then
            if [ "$is_critical" = "true" ]; then
                return $EXIT_ERROR
            else
                exit_status=$EXIT_WARN
            fi
        fi
    done < <(get_tool_commands "$tool")

    return $exit_status
}

check_git() {
    if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
        log "ERROR" "🚫 Not in a git repository"
        return $EXIT_ERROR
    fi
    return $EXIT_OK
}

try_nix() {
    log "INFO" "🔍 checking for Nix ..."

    if ! command -v nix-shell >/dev/null 2>&1; then
        log "ERROR" "🚫 Nix is not installed. You can either:"
        log "ERROR" "   1. Install Nix from https://nixos.org/download.html"
        log "ERROR" "   2. Manually install these tools:"
        for tool in "${missing_tools[@]}"; do
            local url
            url=$(get_tool_prop "$tool" "url" "")
            [ -n "$url" ] && log "ERROR" "      - ${tool}: ${url}"
        done
        log "ERROR" "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    fi

    log "INFO" "✅ found Nix"

    log "INFO" "🔍 checking for Nix configuration files ..."
    if [ ! -f shell.nix ] && [ ! -f default.nix ]; then
        log "ERROR" "🚫 No shell.nix or default.nix found"
        log "ERROR" "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    fi

    log "INFO" "✅ found Nix configuration files"
    log "INFO" "🔍 starting Nix shell ..."

    if [ -f shell.nix ]; then
        exec nix-shell shell.nix
    else
        exec nix-shell default.nix
    fi
}

main() {
    local exit_status=$EXIT_OK

    load_requirements

    check_git || exit_status=$EXIT_ERROR

    missing_tools=()

    while IFS= read -r tool; do
        if ! check_tool "$tool"; then
            missing_tools+=("$tool")
            if [ "$(get_tool_prop "$tool" "critical" "false")" = "true" ]; then
                exit_status=$EXIT_ERROR
            elif [ $exit_status -eq $EXIT_OK ]; then
                exit_status=$EXIT_WARN
            fi
        fi
    done < <(echo "$TOOLS" | jq -r 'keys[]')

    if [ ${#missing_tools[@]} -ne 0 ]; then
        log "INFO" "🔍 attempting to provide missing tools: ${missing_tools[*]} ..."
        try_nix

        log "INFO" "🔍 checking tools again ..."
        still_missing=()
        for tool in "${missing_tools[@]}"; do
            if ! check_tool "$tool"; then
                still_missing+=("$tool")
                exit_status=$EXIT_ERROR
            fi
        done

        if [ ${#still_missing[@]} -ne 0 ]; then
            log "ERROR" "🚫 Still missing tools: ${still_missing[*]}"
            log "ERROR" "Please install the missing tools manually:"
            for tool in "${still_missing[@]}"; do
                local url
                url=$(get_tool_prop "$tool" "url" "")
                [ -n "$url" ] && log "ERROR" "   - ${tool}: ${url}"
            done
            log "ERROR" "🥺 Script doesn't know how to continue"
            exit $EXIT_ERROR
        fi
    fi

    log "INFO" "✅ all required tools are available"
    exit $exit_status
}

main
