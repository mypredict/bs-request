async function fetching({ url, options }) {
  try {
    const response = await fetch(url, options);
    if (response.ok) {
      const contentType = options.contentType || response.headers.get('Content-Type');
      switch (contentType) {
        case 'application/json; charset=utf-8':
          return await response.json();
        default:
          return await response.text();
      }
    }
    return response;

  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error(err);
    }
  }
}

export default fetching;
