#!/usr/bin/env sh

GREEN='\033[1;32m'
BOLD='\033[1m'
RESET='\033[0m'

function log {
  echo "${BOLD}${GREEN}${1}${RESET}"
}
export -f log;
