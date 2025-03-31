{ pkgs ? import <nixpkgs> {}
}:
let
  # node 14.15.4
  nodePkgs = import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/59d4f4885138507cbdb2959f7e52ca89527af143.tar.gz") { };
in
pkgs.mkShell {
  name = "ayup.admin";
  buildInputs = with pkgs; [
    bashInteractive
    nodePkgs.nodejs-14_x
  ];
}