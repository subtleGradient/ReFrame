{
  description = "ReFrame development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    ...
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            # Enable non-free packages if needed
            allowUnfree = true;
            # Allow broken packages as fallback
            allowBroken = false;
          };
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            jq
            bun
            nodejs_24
            ripgrep
            cocoapods
          ];
        };
      }
    );
}
