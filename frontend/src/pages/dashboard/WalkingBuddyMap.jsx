import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Card, CardBody, Button } from "@material-tailwind/react";
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
const createIcon = (color = 'blue') => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const MapController = ({ bounds }) => {
  const map = useMap();
  
  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);

  return null;
};

const WalkingBuddyMap = () => {
  const [activePoint, setActivePoint] = useState(null);
  const [points, setPoints] = useState({
    start1: [33.4255, -111.9405], 
    start2: [33.4224, -111.9426], 
    dest1: [33.4216, -111.9347],  
    dest2: [33.4240, -111.9289]   
});
  const [routes, setRoutes] = useState({ route1: [], route2: [] });
  const mapRef = useRef();

  const calculateRoute = async (start, end) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/foot/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`
      );
      const data = await response.json();
      return data.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
    } catch (error) {
      console.error("Routing error:", error);
      return [];
    }
  };

  useEffect(() => {
    const updateRoutes = async () => {
      const [route1, route2] = await Promise.all([
        calculateRoute(points.start1, points.dest1),
        calculateRoute(points.start2, points.dest2)
      ]);
      setRoutes({ route1, route2 });
    };

    updateRoutes();
  }, [points]);

  const handleMapClick = useCallback((e) => {
    if (!activePoint || !mapRef.current) return;
    const { lat, lng } = e.latlng;
    setPoints(prev => ({ ...prev, [activePoint]: [lat, lng] }));
  }, [activePoint]);

  const getMapBounds = useCallback(() => {
    const allPoints = [
      points.start1,
      points.start2,
      points.dest1,
      points.dest2,
      ...routes.route1,
      ...routes.route2
    ].filter(p => p && p.length === 2);
    
    return allPoints.length > 0 ? L.latLngBounds(allPoints) : null;
  }, [points, routes]);

  return (
    <Card className="h-full">
      <CardBody className="p-0 h-full flex flex-col">
        <div className="p-4 bg-gray-100">
          <h2 className="text-xl font-semibold mb-2">Walking Buddy Map</h2>
          <div className="flex flex-wrap gap-2">
            {['start1', 'start2', 'dest1', 'dest2'].map((point) => (
              <Button
                key={point}
                color={activePoint === point ? 'blue' : 'gray'} 
                variant={activePoint === point ? 'filled' : 'outlined'}
                size="sm"
                className="capitalize"
                onClick={() => setActivePoint(activePoint === point ? null : point)}
              >
                {point.includes('start') ? 'Start' : 'Destination'} {point.slice(-1)}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="flex-1 relative" style={{ minHeight: '500px' }}>
          <MapContainer
            center={[51.505, -0.09]}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
            whenCreated={(map) => {
              mapRef.current = map;
              map.on('click', handleMapClick);
            }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <MapController bounds={getMapBounds()} />

            <Marker position={points.start1} icon={createIcon('blue')}>
              <Popup>Start Point 1</Popup>
            </Marker>

            <Marker position={points.start2} icon={createIcon('blue')}>
              <Popup>Start Point 2</Popup>
            </Marker>

            <Marker position={points.dest1} icon={createIcon('green')}>
              <Popup>Destination 1</Popup>
            </Marker>

            <Marker position={points.dest2} icon={createIcon('red')}>
              <Popup>Destination 2</Popup>
            </Marker>

            <Polyline
              positions={routes.route1}
              color="#0ea5e9"
              weight={4}
              opacity={0.7}
            />

            <Polyline
              positions={routes.route2}
              color="#10b981"
              weight={4}
              opacity={0.7}
            />
          </MapContainer>
        </div>
      </CardBody>
    </Card>
  );
};

export default WalkingBuddyMap;