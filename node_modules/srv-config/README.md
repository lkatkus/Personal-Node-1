# srv-config
## Configuration functionality for server blueprint

Reads configuration from file. File location can be specified in environment variable `CONF_DIR` (defaults to `process.cwd()`). File name can be specified in environment variable `CONF_FILE` (defaults to `config.properties`).

- Class `Config`
    - `globalConfig` global configuration object (shallow copy)
    - `confDir` directory for configuration files
    - `initGlobalConfig()` reads configuration file and initializes global configuration
    - `getValue()` retrieves value from default configuration via specified string path
