# Migration from shell.nix to flake.nix

This document outlines the migration from a traditional `shell.nix` setup to the more modern Nix Flakes with direnv integration.

## Why migrate?

1. **Reproducibility**: Flakes provide a more deterministic approach to dependencies by pinning them precisely.
2. **Composability**: Easier to combine multiple projects and dependencies.
3. **Standardized structure**: Common interface for Nix projects.
4. **Improved caching**: Better cache utilization with content-addressed approach.
5. **Direnv integration**: Automatically activate the development environment when entering the project directory.

## What changed?

### New files

- `flake.nix`: The main configuration file for Nix Flakes
- `flake.lock`: Auto-generated dependency lockfile (similar to package-lock.json)
- `.envrc`: Configuration file for direnv to automatically load the environment

### Updated files

- `package.json`: Updated `sh` script to use `nix develop` instead of `nix-shell`
- `.gitignore`: Added patterns for direnv-specific files

## Prerequisites

To use this setup, you need:

1. Nix with flakes enabled
2. direnv installed and configured

## How to set up Nix with Flakes

### 1. Install Nix

Follow the official instructions at [nixos.org/download](https://nixos.org/download.html)

### 2. Enable Flakes

Add to your `~/.config/nix/nix.conf` (create if it doesn't exist):

```
experimental-features = nix-command flakes
```

### 3. Install direnv

Using Nix:
```
nix-env -iA nixpkgs.direnv
```

Or using your system package manager (e.g., Homebrew on macOS):
```
brew install direnv
```

### 4. Configure direnv

Add to your shell configuration (`~/.bashrc`, `~/.zshrc`, etc.):

```bash
# For bash
eval "$(direnv hook bash)"

# For zsh
eval "$(direnv hook zsh)"
```

## How to use

After the setup:

1. Navigate to the project directory. direnv will automatically load the environment.
2. The first time, you need to run `direnv allow` to permit direnv to load the environment.
3. You can still use `bun run sh` or directly run `nix develop` to manually enter the environment.

## Troubleshooting

### direnv not loading

Make sure you've added the direnv hook to your shell configuration and restarted your terminal.

### Nix flake errors

If you see errors about Git or untracked files, make sure the flake files are tracked by Git:

```
git add flake.nix flake.lock .envrc
```

### "Error loading flake"

If you see this message in the direnv output, check:
1. Nix is installed and flakes are enabled
2. The flake.nix syntax is correct
3. All dependencies can be resolved

## Reverting to shell.nix

The original `shell.nix` file is still available. You can use it directly with:

```
nix-shell
```