let
  # Fetch the unstable nixpkgs
  unstable = import (fetchTarball "https://github.com/nixos/nixpkgs/archive/nixos-unstable.tar.gz") {};
  # Fetch the stable nixpkgs
  stable = import <nixpkgs> {};
in
unstable.mkShell {
  buildInputs = [
    # From unstable channel
    unstable.bun
    unstable.ollama
    # From stable channel
    stable.git
  ];

  shellHook = ''
    echo "Development environment loaded with unstable channel packages!"
    echo "bun version: $(bun --version)"
    echo "ollama version: $(ollama --version)"
    echo "git version: $(git --version)"
  '';
}
