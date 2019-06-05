import axios from 'axios';
import url from 'url';

function throwError(message) {
  const error = new Error(message);
  throw error;
}

function extractSettings({
  hostname, port, protocol, id, token, pathname,
}) {
  const defaultProtocol = 'https';
  const defaultPort = 443;

  if (!hostname) {
    throwError('A hostname should be provided');
  }
  if (!id || !token) {
    throwError('Both id and token should be provided');
  }

  return {
    hostname,
    port: !port ? defaultPort : port,
    protocol: !protocol ? defaultProtocol : protocol,
    id,
    token,
    pathname: pathname || '',
  };
}

function buildUri(protocol, hostname, port, pathname, query) {
  return url.format({
    protocol, hostname, port, pathname, query,
  });
}

class Storage {
  constructor(options) {
    this.options = extractSettings(options);
  }

  async listData(query) {
    const uri = buildUri(
      this.options.protocol,
      this.options.hostname,
      this.options.port,
      `${this.options.pathname}/data`,
      query,
    );
    const headers = {
      auth_id: this.options.id,
      auth_token: this.options.token,
    };

    const response = await axios.get(uri, { headers });
    return response.data;
  }
}

export default Storage;