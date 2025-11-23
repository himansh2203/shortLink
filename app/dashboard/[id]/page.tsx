import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const StatsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetch(`/api/stats/${id}`)
        .then((response) => response.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching stats:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!stats) {
    return <div>No statistics available for this link.</div>;
  }

  return (
    <div>
      <h1>Statistics for {stats.shortenedUrl}</h1>
      <p>Total Clicks: {stats.totalClicks}</p>
      <p>Created At: {new Date(stats.createdAt).toLocaleString()}</p>
      <h2>Click History</h2>
      <ul>
        {stats.clickHistory.map((click, index) => (
          <li key={index}>
            Clicked at: {new Date(click.timestamp).toLocaleString()} from IP: {click.ipAddress}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StatsPage;