type AppConfig = {
  http: {
    host: string;
    port: number;

    session: {
      expiration: number, // 1 week
      cookie_name: string,
      // should be your domain or IP address. if this doesn't match your
      // javascript origin then the cookie will not be set or transmitted to the
      // server in XHR requests.
      cookie_domain: string | nullnull, // null to omit. only do this if you're on localhost.
      cookie_path: string,
      cookie_secure: boolean, // true for https
      cookie_http_only: boolean,
    },
  },

  postgres: import('sequelize').Options,

  siteSettings: {
    auth: {
      allowRegistration: boolean,

      NOT_IMPLEMENTED: Record<string, any>,
    },
  },
}
