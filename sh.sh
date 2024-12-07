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
        "bun")
            version=$(bun --version)
            ;;
        "ollama")
            version=$(ollama --version)
            ;;
        "git")
            version=$(git --version | cut -d' ' -f3)
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
        [[ "${missing_tools[*]}" =~ "bun" ]] && echo "      - bun: https://bun.sh"
        [[ "${missing_tools[*]}" =~ "ollama" ]] && echo "      - ollama: https://ollama.ai"
        [[ "${missing_tools[*]}" =~ "git" ]] && echo "      - git: https://git-scm.com"
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

    # Step 1: Verify we're in a git repository
    check "in a git repository" "git rev-parse --is-inside-work-tree" || exit_status=$EXIT_ERROR

    # Step 2: Check for required tools
    missing_tools=()

    if ! check_tool "bun" "1.0.0" false; then
        missing_tools+=("bun")
        [ $exit_status -eq $EXIT_OK ] && exit_status=$EXIT_WARN
    fi

    if ! check_tool "ollama" "0.1.0" false; then
        missing_tools+=("ollama")
        [ $exit_status -eq $EXIT_OK ] && exit_status=$EXIT_WARN
    fi

    if ! check_tool "git" "2.0.0" true; then
        missing_tools+=("git")
        exit_status=$EXIT_ERROR
    fi

    # If there are missing tools, try using nix
    if [ ${#missing_tools[@]} -ne 0 ]; then
        echo "🔍 attempting to provide missing tools: ${missing_tools[*]} ..."
        try_nix

        # Check tools again after nix-shell
        echo "🔍 checking tools again ..."
        still_missing=()
        for tool in "${missing_tools[@]}"; do
            if ! check_tool "$tool" "0.0.0" true; then
                still_missing+=("$tool")
                exit_status=$EXIT_ERROR
            fi
        done

        if [ ${#still_missing[@]} -ne 0 ]; then
            echo "🚫 Still missing tools: ${still_missing[*]}"
            echo "Please install the missing tools manually:"
            for tool in "${still_missing[@]}"; do
                case $tool in
                    "bun")
                        echo "   - bun: https://bun.sh"
                        ;;
                    "ollama")
                        echo "   - ollama: https://ollama.ai"
                        ;;
                    "git")
                        echo "   - git: https://git-scm.com"
                        ;;
                esac
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
