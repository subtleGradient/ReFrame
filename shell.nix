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
    let
      tool = requiredTools.${name};
      pkgSet = if tool.channel == "unstable" then unstable else stable;
      nixName = if builtins.hasAttr "nixPackage" tool then tool.nixPackage else name;
    in pkgSet.${nixName};

  # Convert tool names to packages
  packages = builtins.map getPackage (builtins.attrNames requiredTools);

  # Helper function to generate version check command
  makeVersionCheck = name:
    let
      tool = requiredTools.${name};
      commands = if builtins.hasAttr "command" tool then
        (if builtins.isList tool.command then tool.command else [tool.command])
      else
        [name];
    in builtins.concatStringsSep "\n" (map (cmd:
      "echo \"${name} (${cmd}) version: $(${cmd} --version 2>/dev/null || ${cmd} -v 2>/dev/null || echo 'version not available')\"")
      commands);
in
unstable.mkShell {
  buildInputs = packages;

  shellHook = ''
    echo "Development environment loaded!"
    ${builtins.concatStringsSep "\n" (builtins.map makeVersionCheck (builtins.attrNames requiredTools))}

    # Make the script executable if it isn't already
    chmod +x ./sh.sh
    # Run the verification script in quiet mode
    ./sh.sh --quiet
  '';
}
