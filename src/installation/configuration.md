# Configuration options

:::tip
Since `v0.20.0` Komga has sensible default values for all configuration keys. You only need to configure it if you want to change the default behaviour.

The `application.yml` file does not exist by default, you need to create one if you want to customize the configuration.

:::

Komga relies heavily on [Spring Boot's configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html), leveraging `profiles` and configuration `properties`.

The easiest way to configure is either via environment variables (a good fit for `docker` and `docker-compose`) or by using an `application.yml` file located in the current directory when you start Komga. The easiest way is to place it in the same directory as the `jar` file, and to `cd` to this directory before starting Komga.

Each configuration key can have a different format depending if it's from the environment variable, or from the `application.yml` file. In the following section I will provide both format in the form `ENVIRONMENT_VARIABLE` / `application-property`.

## Optional configuration

You can use some optional configuration keys:

#### SERVER_PORT / server.port: `<port>`

Port to listen to for the API and web interface.

Defaults to `8080`.

#### SERVER_SERVLET_CONTEXT_PATH / server.servlet.context-path: `<baseUrl>`

Base URL, useful if you need to reverse proxy with a subfolder.

Defaults to `/`.

#### KOMGA_LIBRARIES_SCAN_CRON / komga.libraries-scan-cron: `<cron>`

a [Spring cron expression](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/support/CronSequenceGenerator.html) for libraries periodic rescans.
For example `0 0 * * * ?` will rescan every hour. `0 */15 * * * ?` will rescan every 15 minutes.

Defaults to `0 */15 * * * ?`.

#### KOMGA_LIBRARIES_SCAN_STARTUP / komga.libraries-scan-startup: `<true/false>` <Badge text="0.28.0+" />

a boolean indicating if Komga should scan your libraries at startup.

Defaults to `false`.

#### KOMGA_LIBRARIES_SCAN_DIRECTORY_EXCLUSIONS / komga.libraries-scan-directory-exclusions: `<exclusions>`

a list of patterns to exclude directories from the scan. If the full path contains any of the patterns, the directory will be ignored. If using the environment variable you need to use a comma-separated list.

Defaults to `#recycle,@eaDir`.

#### KOMGA_FILESYSTEM_SCANNER_FORCE_DIRECTORY_MODIFIED_TIME / komga.filesystem-scanner-force-directory-modified-time: `<force>`

if set to `true`, it will force the last modified time of a directory as the maximum from its own last modified time and the last modified time from all the books inside the directory. This should be used only if your filesystem does not update the last modified time of a directory when files inside it are modified (Google Drive for instance).

Defaults to `false`.

#### KOMGA_REMEMBERME_KEY / komga.remember-me.key: `<key>`

If set, the remember-me auto-login feature will be activated, and will generate a cookie with encoded login information to perform auto-login.

Not set by default, you need to set it to enable this feature.

#### KOMGA_REMEMBERME_VALIDITY / komga.remember-me.validity: `<validity>`

The validity, in seconds, of the generated remember-me cookie.

Defaults to 2 weeks.

#### KOMGA_DATABASE_BACKUP_ENABLED / komga.database-backup.enabled: `<true/false>` <Badge text="0.37.0+" />

a boolean indicating if Komga should automatically backup your database.

Defaults to `true`.

#### KOMGA_DATABASE_BACKUP_STARTUP / komga.database-backup.startup: `<true/false>` <Badge text="0.37.0+" />

a boolean indicating if Komga should perform a database backup on startup (if backup is enabled).

Defaults to `true`.

#### KOMGA_DATABASE_BACKUP_SCHEDULE / komga.database-backup.schedule: `<cron>` <Badge text="0.37.0+" />

a [Spring cron expression](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/support/CronSequenceGenerator.html) to execute database backups.

Defaults to `0 0 */6 * * ?` (every 6 hours).

#### KOMGA_DATABASE_BACKUP_PATH / komga.database-backup.path: `<path of the generated backup>` <Badge text="0.37.0+" />

The path of the generated database backup. The backup generated is a `ZIP` file.

Defaults to:
- `~/.komga/database-backup.zip` for _Jar_.
- `/config/database-backup.zip` for _Docker_.

#### SPRING_DATASOURCE_URL / spring.datasource.url: `jdbc:h2:<path of the database file>`

The path of the database file on disk.

Defaults to:
- `jdbc:h2:~/.komga/database.h2` for _Jar_. `~` is your home directory on Unix, and your User profile on Windows.
- `jdbc:h2:/config/database.h2` for _Docker_.

#### LOGGING_FILE_NAME / logging.file.name: `<logfile name>`

Name of the log file.

Defaults to:
- `~/.komga/komga.log` for _Jar_. `~` is your home directory on Unix, and your User profile on Windows.
- `/config/logs/komga.log` for _Docker_.

_When overriding this configuration, you need to use `\${user.home}` instead of `~` (this is a specific Spring Boot variable)._

## Sample Configuration File

Here is a sample `application.yml` file in case you need to customize it. Keep only the lines you need.

```yaml
komga:
  libraries-scan-cron: "* */15 * * * ?" #periodic scan every 15 minutes
  libraries-scan-startup: false #scan libraries at startup
  libraries-scan-directory-exclusions: #patterns to exclude directories from the scan
    - "#recycle" #synology NAS recycle bin
    - "@eaDir"   #synology NAS index/metadata folders
  filesystem-scanner-force-directory-modified-time: false #set to true only if newly added books in existing series are not scanned (ie Google Drive)
  remember-me:
    key: changeMe! #required to activate the remember-me auto-login via cookies
    validity: 2592000 #validity of the cookie in seconds, here 1 month
  database-backup:
    path: ~/.komga/database-backup.zip
    schedule: "0 0 */6 * * ?" #every 6 hours
    enabled: true
    startup: true
server:
  port: 8080
  servlet.context-path: /komga
spring:
  datasource:
    url: jdbc:h2:/path/to/your/database.h2 #absolute path for Unix
    url: jdbc:h2:D:\\komga\database.h2 #absolute path for Windows
    url: jdbc:h2:~/.komga/database.h2 #relative path to user home directory
    url: jdbc:h2:./komga/database.h2 #relative path to current directory
```

## HTTPS

If you want to open your Komga server outside your local network, it is strongly advised to secure it with `https` (especially due to the use of http basic authentication).

Spring Boot supports `https` out of the box, but you will have to configure it, and `https` is most useful only with valid certificates (not self-signed), which most people don't readily have available.

I recommend using [Caddy](https://caddyserver.com/) as a reverse proxy, as it supports the automatic generation of [Let's Encrypt](https://letsencrypt.org/) certificates.

## Reverse proxy

Here are some sample configuration on how to configure reverse proxy for Komga.

### Caddy (v1)

```
komga.yourdomain.com {
  proxy / http://your-komga-server:8080 {
    transparent
  }
}
```

With a base URL configured in Komga:

```
yourdomain.com {
  proxy /komga http://your-komga-server:8080 {
    transparent
  }
}
```