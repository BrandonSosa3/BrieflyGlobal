import mapboxgl from 'mapbox-gl';
import { useEffect, useRef } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYnNvc2EzIiwiYSI6ImNtZHJzODg5dDBqdzQyaW9uNG5zMHY1Z3gifQ.JCDvwEYqpzwXFKoS9L5xjg';

function WorldMap() {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [100,20],
      zoom: 1.5,
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} className="w-full h-[90vh] rounded-lg shadow-lg" />;
}

export default WorldMap;

