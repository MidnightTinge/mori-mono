export default function addResponseAugmentation() {
  return (req, res, next) => {
    res.response ??= function response({ok, m, data}: { ok: boolean, m?: string, data?: any }) {
      return res.json({
        ok,
        m,
        data,
      });
    };

    res.ok ??= function ok(m: string, data?: any) {
      return res.response({
        ok: true,
        m,
        data,
      });
    };

    res.nok ??= function nok(m: string, data?: any) {
      if (typeof m !== 'string') {
        data = m;
        m = '';
      }

      return res.response({
        ok: false,
        m,
        data,
      });
    };

    res.c404 ??= function c404(m?: string) {
      return res.status(404).response({
        ok: false,
        m: m ?? 'Not Found',
      });
    };

    res.c500 ??= function c500(m?: string) {
      return res.status(500).response({
        ok: false,
        m: m ?? 'Internal Server Error',
      });
    };

    res.c400 ??= function c400(m?: string) {
      return res.status(400).response({
        ok: false,
        m: m ?? 'Bad Request',
      });
    };

    res.c401 ??= function c401(m?: string) {
      return res.status(401).response({
        ok: false,
        m: m ?? 'Unauthorized',
      });
    };

    res.c403 ??= function c403(m?: string) {
      return res.status(403).response({
        ok: false,
        m: m ?? 'Forbidden',
      });
    };

    res.c405 ??= function c405(m?: string) {
      return res.status(405).response({
        ok: false,
        m: m ?? 'Method Not Allowed',
      });
    };

    res.c409 ??= function c409(m?: string) {
      return res.status(409).response({
        ok: false,
        m: m ?? 'Conflict',
      });
    };

    res.c429 ??= function c429(m?: string) {
      return res.status(429).response({
        ok: false,
        m: m ?? 'Too Many Requests',
      });
    };

    res.c503 ??= function c503(m?: string) {
      return res.status(503).response({
        ok: false,
        m: m ?? 'Service Unavailable',
      });
    };

    next();
  };
}
