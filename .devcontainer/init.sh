#!/usr/bin/env bash

set -e
cd "$(dirname "$0")/.."

# Install HA
python3 -m pip install pip colorlog homeassistant

# See: https://github.com/home-assistant/core/issues/95192
python3 -m pip install git+https://github.com/boto/botocore

# Create directory for HA
if [[ ! -d "${PWD}/.ha" ]]; then
    mkdir -p "${PWD}/.ha"
fi

# Link the configuration
if [[ ! -f "${PWD}/.ha/configuration.yaml" ]]; then
    ln -s "${PWD}/configuration.yaml" "${PWD}/.ha/configuration.yaml"
fi

if [[ ! -f "${PWD}/.ha/test-dashboard.yaml" ]]; then
    ln -s "${PWD}/test-dashboard.yaml" "${PWD}/.ha/test-dashboard.yaml"
fi


hass --config "${PWD}/.ha" --script ensure_config