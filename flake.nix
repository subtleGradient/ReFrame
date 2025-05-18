{
  description = "ReFrame development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            # Enable non-free packages if needed
            allowUnfree = true;
            # Allow broken packages as fallback
            allowBroken = false;
          };
        };
        
        # Check if we're on Darwin (macOS)
        isDarwin = pkgs.stdenv.isDarwin;
        
        # Platform-specific dependencies
        platformSpecificPackages = if isDarwin then [
          # macOS specific packages
          pkgs.darwin.apple_sdk.frameworks.CoreServices
          pkgs.darwin.apple_sdk.frameworks.Foundation
        ] else [
          # Linux alternatives if needed
        ];

        # Function to safely access a package or return null if not available
        safePackage = name:
          if builtins.hasAttr name pkgs
          then pkgs.${name}
          else null;

        # Get CocoaPods for the current platform if available
        cocoaPodsPackage = 
          if isDarwin 
          then safePackage "cocoapods"
          else null;
          
        # Optional packages (attempt to include but don't fail if unavailable)
        optionalPackages = builtins.filter (p: p != null) [
          cocoaPodsPackage
        ];
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # Core tools requested
            jq
            bun
            nodejs_24
            ripgrep
            
          ] ++ optionalPackages ++ platformSpecificPackages;

          # Shell hook for additional setup
          shellHook = ''
            echo "ReFrame development environment loaded!"
            
            # Set up environment variables
            export PATH="$PWD/node_modules/.bin:$PATH"
            
            # Check for tools
            echo "Node.js: $(node --version 2>/dev/null || echo 'not available')"
            echo "Bun: $(bun --version 2>/dev/null || echo 'not available')"
            echo "jq: $(jq --version 2>/dev/null || echo 'not available')"
            echo "ripgrep: $(rg --version 2>/dev/null | head -n 1 || echo 'not available')"
            
            # Make scripts executable
            if [ -d "./sh" ] && [ -f "./sh/sh.sh" ]; then
              chmod +x ./sh/sh.sh
            fi
          '';
        };
      }
    );
}