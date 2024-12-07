#!/usr/bin/env bash

# Set strict error handling
set -euo pipefail

# Exit codes
readonly EXIT_OK=0
readonly EXIT_WARN=1      # Recoverable error
readonly EXIT_ERROR=2     # Unrecoverable error

# Global error handler
error_handler() {
    local error_code=$?
    local line_number=$1
    echo "🚫 Error occurred in line ${line_number} with exit code ${error_code}"
    echo "🥺 Script doesn't know how to continue"
    exit $EXIT_ERROR
}

# Set up error handling
trap 'error_handler ${LINENO}' ERR

# Load tool requirements from package.json
load_requirements() {
    if [ ! -f package.json ]; then
        echo "🚫 package.json not found"
        echo "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    fi

    # Requires jq to be installed
    if ! command -v jq >/dev/null 2>&1; then
        echo "🚫 jq is required to parse package.json"
        echo "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    fi

    # Read tools configuration into variables
    TOOLS=$(jq -r '.config.tools.required' package.json)
}

# Function to get tool property
get_tool_prop() {
    local tool=$1
    local prop=$2
    echo "$TOOLS" | jq -r ".[\"$tool\"][\"$prop\"]"
}

# Check function with different status levels
check() {
    local description=$1
    local command=$2
    local is_critical=${3:-true}  # Default to critical

    echo "🔍 ${description} ..."

    if eval "${command}" >/dev/null 2>&1; then
        echo "✅ ${description}"
        return $EXIT_OK
    elif [ "${is_critical}" = "true" ]; then
        echo "🚫 ${description}"
        echo "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    else
        echo "⚠️ ${description} (some features may not work as expected)"
        return $EXIT_WARN
    fi
}

# Function to check if a command exists and meets version requirements
check_tool() {
    local tool=$1
    local min_version=$2
    local is_critical=${3:-true}  # Default to critical

    echo "🔍 checking for ${tool} ..."

    if ! command -v "$tool" >/dev/null 2>&1; then
        if [ "${is_critical}" = "true" ]; then
            echo "🚫 ${tool} is not installed"
            return $EXIT_ERROR
        else
            echo "⚠️ ${tool} is not installed (some features may not work as expected)"
            return $EXIT_WARN
        fi
    fi

    local version
    case $tool in
        *)
            version=$(${tool} --version 2>&1 | head -n1)
            ;;
    esac

    echo "✅ found ${tool} version ${version}"
    return $EXIT_OK
}

# Function to try using nix-shell
try_nix() {
    echo "🔍 checking for Nix ..."

    if ! command -v nix-shell >/dev/null 2>&1; then
        echo "🚫 Nix is not installed. You can either:"
        echo "   1. Install Nix from https://nixos.org/download.html"
        echo "   2. Manually install these tools:"
        for tool in "${missing_tools[@]}"; do
            echo "      - ${tool}: $(get_tool_prop "$tool" "url")"
        done
        echo "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    fi

    echo "✅ found Nix"

    echo "🔍 checking for Nix configuration files ..."
    if [ ! -f shell.nix ] && [ ! -f default.nix ]; then
        echo "🚫 No shell.nix or default.nix found"
        echo "🥺 Script doesn't know how to continue"
        exit $EXIT_ERROR
    fi

    echo "✅ found Nix configuration files"
    echo "🔍 starting Nix shell ..."

    if [ -f shell.nix ]; then
        exec nix-shell shell.nix
    else
        exec nix-shell default.nix
    fi
}

main() {
    local exit_status=$EXIT_OK

    # Load requirements from package.json
    load_requirements

    # Step 1: Verify we're in a git repository
    check "in a git repository" "git rev-parse --is-inside-work-tree" || exit_status=$EXIT_ERROR

    # Step 2: Check for required tools
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

    # If there are missing tools, try using nix
    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo "🔍 attempting to provide missing tools: ${missing_tools[*]} ..."
        try_nix

        # Check tools again after nix-shell
        echo "🔍 checking tools again ..."
        still_missing=()
        for tool in "${missing_tools[@]}"; do
            if ! check_tool "$tool" "$(get_tool_prop "$tool" "version")" "$(get_tool_prop "$tool" "critical")"; then
                still_missing+=("$tool")
                exit_status=$EXIT_ERROR
            fi
        done

        if [ ${#still_missing[@]} -ne 0 ]; then
            echo "🚫 Still missing tools: ${still_missing[*]}"
            echo "Please install the missing tools manually:"
            for tool in "${still_missing[@]}"; do
                echo "   - ${tool}: $(get_tool_prop "$tool" "url")"
            done
            echo "🥺 Script doesn't know how to continue"
            exit $EXIT_ERROR
        fi
    fi

    echo "✅ all required tools are available"
    exit $exit_status
}

# Execute main function
main
