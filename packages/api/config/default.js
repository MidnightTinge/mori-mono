/** @type {AppConfig} */
module.exports = exports = {
  http: {
    host: 'localhost',
    port: 3000,

    session: {
      expiration: 1000 * 60 * 60 * 24 * 7, // 1 week
      cookie_name: '_mori.sid',
      // should be your domain or IP address. if this doesn't match your
      // javascript origin then the cookie will not be set or transmitted to the
      // server in XHR requests.
      cookie_domain: null, // null to omit. only do this if you're on localhost.
      cookie_path: '/',
      cookie_secure: false, // true for https
      cookie_http_only: true,
    },
  },
  postgres: {
    dialect: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'mori',
    username: 'mori',
    password: 'password',
  },

  // TODO: these will eventually be extracted to the database for admins
  siteSettings: {
    auth: {
      // set to `false` to disable registration. useful for single-user or
      // self-hosted instances.
      allowRegistration: true,

      // The following settings are not yet implemented. They are here for
      // future reference.
      NOT_IMPLEMENTED: {
        mode: 'username', // 'username' or 'email'

        // set to true to allow anyone to register
        allowedEmailDomains: ['acme.com'],

        // the regex used to validate usernames
        usernameRegex() {
          return /^[a-zA-Z0-9_]{3,16}$/;
        },

        // the regex used to validate passwords
        passwordRegex() {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        },

        // when true, we'll allow users to use the `+attn` trick to create
        // multiple accounts with the same email address. this is useful for
        // testing.
        allowAttn: true,

        // when true, we'll strip dots so that "joe.smith" and "joesmith" are the
        // same user. this is useful for some services where dots are ignored,
        // e.g. gmail.
        stripDots: false,
      },
    },
  },
};
