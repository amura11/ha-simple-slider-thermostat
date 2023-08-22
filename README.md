# Home Assistant - Simple Slider Thermostat

[![hacs][hacsbadge]][hacs]
[![HACS Validation][validation-shield]](validation)

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)

A simple slider based thermostat card for Home Assistant.

## Examples

### Basic
TODO

## Installation

### Manually
1. Copy the files from the `dist` directory to the `<config>/www/`
1. Add the following to the `configuration.yaml` file:
    ```
    lovelace:
    resources:
        - url: /local/ha-simple-slider-thermostat.js?v=1
        type: module
    ```

Note: You can place the files into a sub directory under `<config>/www/<sub-directory>`. If you choose this option ensure the path in the `configuration.yaml` file reflects this. Eg.:
```
lovelace:
  resources:
    - url: /local/<sub-directory>/ha-simple-slider-thermostat.js?v=1
      type: module
```

### Via HACS
1. Add the repository to HACS
1. Install the Frontend addon
1. Add the following to the `configuration.yaml` file:
    ```
    lovelace:
    resources:
        - url: /hacsfiles/ha-simple-slider-thermostat.js
        type: module
    ```

## Configuration Options

Name | Type | Description | Default
-- | -- | -- | -- 



[releases-shield]: https://img.shields.io/github/release/amura11/ha-simple-slider-thermostat.svg?style=for-the-badge
[releases]: https://github.com/amura11/ha-simple-slider-thermostat/releases
[hacs]: https://github.com/hacs/integration
[hacsbadge]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge
[validation-shield]: https://img.shields.io/github/actions/workflow/status/amura11/ha-simple-slider-thermostat/validate.yml?style=for-the-badge&label=HACS%20Validation
[validation]: https://github.com/amura11/ha-simple-slider-thermostat/actions/workflows/validate.yml
[license-shield]: https://img.shields.io/github/license/amura11/ha-simple-slider-thermostat.svg?style=for-the-badge