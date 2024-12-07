#!/usr/bin/env bash

# Set strict error handling
set -euo pipefail

# Global error handler
error_handler() {
    local error_code=$?
    local line_number=$1
    echo "❌ Error occurred in line ${line_number} with exit code ${error_code}"
    
    case ${error_code} in
        1)
            echo "Generic error occurred"
            ;;
        127)
            echo "Command not found"
            echo "Please ensure Nix is installed on your system:"
            echo "1. Visit https://nixos.org/download.html"
            echo "2. Follow the installation instructions for your OS"
            ;;
        *)
            echo "Unknown error occurred"
            ;;
    esac
    
    exit ${error_code}
}

# Set up error handling
trap 'error_handler ${LINENO}' ERR

# Log function for consistent output
log() {
    echo "➡️ $1"
}

# Check function to verify invariants
check() {
    local condition=$1
    local message=$2
    local fix_message=$3
    
    if ! eval "${condition}"; then
        echo "❌ ${message}"
        echo "💡 ${fix_message}"
        exit 1
    fi
}

main() {
    # Step 1: Verify we're in a git repository
    log "Checking if we're in a git repository..."
    check "git rev-parse --is-inside-work-tree >/dev/null 2>&1" \
          "Not in a git repository" \
          "Please run this script from within your git repository"

    # Step 2: Verify we're in the root directory
    log "Checking if we're in the repository root..."
    check "[ -d .git ]" \
          "Not in repository root" \
          "Please run this script from the repository root directory"

    # Step 3: Check for nix installation
    log "Checking for Nix installation..."
    check "command -v nix-shell >/dev/null 2>&1" \
          "Nix is not installed" \
          "Please install Nix from https://nixos.org/download.html"

    # Step 4: Check for shell.nix or default.nix
    log "Checking for Nix configuration files..."
    check "[ -f shell.nix ] || [ -f default.nix ]" \
          "No shell.nix or default.nix found" \
          "Please ensure either shell.nix or default.nix exists in the repository root"

    # Step 5: Check if nix-shell can evaluate the configuration
    log "Validating Nix configuration..."
    check "nix-shell --dry-run >/dev/null 2>&1" \
          "Invalid Nix configuration" \
          "Please check your shell.nix or default.nix for errors"

    # Step 6: Start the nix-shell
    log "Starting Nix shell..."
    if [ -f shell.nix ]; then
        log "Using shell.nix configuration"
        exec nix-shell shell.nix
    else
        log "Using default.nix configuration"
        exec nix-shell default.nix
    fi
}

# Execute main function
main

