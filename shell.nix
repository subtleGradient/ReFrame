let
  # Function to read package.json
  packageJson = builtins.fromJSON (builtins.readFile ./package.json);

  # Extract tools from config
  requiredTools = packageJson.config.tools.required;

  # Fetch the unstable nixpkgs
  unstable = import (fetchTarball "https://github.com/nixos/nixpkgs/archive/nixos-unstable.tar.gz") {};
  # Fetch the stable nixpkgs
  stable = import <nixpkgs> {};

  # Helper function to get package from appropriate channel
  getPackage = name:
    let tool = requiredTools.${name};
    in if tool.channel == "unstable"
       then unstable.${name}
       else stable.${name};

  # Convert tool names to packages
  packages = builtins.map getPackage (builtins.attrNames requiredTools);
in
unstable.mkShell {
  buildInputs = packages;

  shellHook = ''
    echo "Development environment loaded!"
    ${builtins.concatStringsSep "\n" (builtins.map (tool:
      "echo \"${tool} version: $(${tool} --version)\""
    ) (builtins.attrNames requiredTools))}
  '';
}
