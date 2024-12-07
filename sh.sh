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
    echo "$TOOLS" | jq -r ".[\"$tool\"][\"$prop\"]"
}

check() {
    local description=$1
    local command=$2
    local is_critical=${3:-true}

    log "INFO" "🔍 ${description} ..."

    if eval "${command}" >/dev/null 2>&1; then
        log "INFO" "✅ ${description}"
        return $EXIT_OK
    elif [ "${is_critical}" = "true" ]; then
        log "ERROR" "🚫 ${description}"
        log "ERROR" "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    else
        log "WARN" "⚠️ ${description} (some features may not work as expected)"
        return $EXIT_WARN
    fi
}

check_tool() {
    local tool=$1
    local min_version=$2
    local is_critical=${3:-true}

    log "INFO" "🔍 checking for ${tool} ..."

    if ! command -v "$tool" >/dev/null 2>&1; then
        if [ "${is_critical}" = "true" ]; then
            log "ERROR" "🚫 ${tool} is not installed"
            return $EXIT_ERROR
        else
            log "WARN" "⚠️ ${tool} is not installed (some features may not work as expected)"
            return $EXIT_WARN
        fi
    fi

    local version
    case $tool in
        *)
            version=$(${tool} --version 2>&1 | head -n1)
            ;;
    esac

    log "INFO" "✅ found ${tool} version ${version}"
    return $EXIT_OK
}

try_nix() {
    log "INFO" "🔍 checking for Nix ..."

    if ! command -v nix-shell >/dev/null 2>&1; then
        log "ERROR" "🚫 Nix is not installed. You can either:"
        log "ERROR" "   1. Install Nix from https://nixos.org/download.html"
        log "ERROR" "   2. Manually install these tools:"
        for tool in "${missing_tools[@]}"; do
            log "ERROR" "      - ${tool}: $(get_tool_prop "$tool" "url")"
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

    check "in a git repository" "git rev-parse --is-inside-work-tree" || exit_status=$EXIT_ERROR

    missing_tools=()

    for tool in $(echo "$TOOLS" | jq -r 'keys[]'); do
        local version=$(get_tool_prop "$tool" "version")
        local critical=$(get_tool_prop "$tool" "critical")

        if ! check_tool "$tool" "$version" "$critical"; then
            missing_tools+=("$tool")
            if [ "$critical" = "true" ]; then
                exit_status=$EXIT_ERROR
            elif [ $exit_status -eq $EXIT_OK ]; then
                exit_status=$EXIT_WARN
            fi
        fi
    done

    if [ ${#missing_tools[@]} -ne 0 ]; then
        log "INFO" "🔍 attempting to provide missing tools: ${missing_tools[*]} ..."
        try_nix

        log "INFO" "🔍 checking tools again ..."
        still_missing=()
        for tool in "${missing_tools[@]}"; do
            if ! check_tool "$tool" "$(get_tool_prop "$tool" "version")" "$(get_tool_prop "$tool" "critical")"; then
                still_missing+=("$tool")
                exit_status=$EXIT_ERROR
            fi
        done

        if [ ${#still_missing[@]} -ne 0 ]; then
            log "ERROR" "🚫 Still missing tools: ${still_missing[*]}"
            log "ERROR" "Please install the missing tools manually:"
            for tool in "${still_missing[@]}"; do
                log "ERROR" "   - ${tool}: $(get_tool_prop "$tool" "url")"
            done
            log "ERROR" "🥺 Script doesn't know how to continue"
            exit $EXIT_ERROR
        fi
    fi

    log "INFO" "✅ all required tools are available"
    exit $exit_status
}

main
