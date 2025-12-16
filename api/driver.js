// api/driver.js
// Vercel serverless function to proxy gtstats.live API

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { psn } = req.query;

  if (!psn) {
    return res.status(400).json({ error: 'PSN name is required' });
  }

  try {
    const response = await fetch(
      `https://gtstats.live/api/getDriverRatingPSN?psn=${psn}`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      }
    );

    if (!response.ok) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Error fetching driver data:', error);
    return res.status(500).json({ error: 'Failed to fetch driver data' });
  }
}
