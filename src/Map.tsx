import React, { useState, useMemo, useCallback } from "react";
import { GoogleMap, LoadScript, Polyline, Marker } from "@react-google-maps/api";

type Location = {
  lat: number;
  lng: number;
};

type MarkerData = {
  lat: number;
  lng: number;
  time: number;
};

type PolylineData = {
  path: Location[];
  color: string;
  markers: MarkerData[];
};

type MapProps = {
  polylines: PolylineData[];
  showArrows: boolean;
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

const Map: React.FC<MapProps> = ({ polylines, showArrows }) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapState, setMapState] = useState({
    zoom: 12,
    center:
      polylines.length > 0 && polylines[0].path.length > 0
        ? polylines[0].path[0]
        : { lat: 46.8721, lng: -113.994 },
  });

  const handleMapLoad = useCallback((loadedMap: google.maps.Map) => {
    setMap(loadedMap);
  }, []);

  const handleMapIdle = useCallback(() => {
    if (map) {
      setMapState((prev) => ({
        zoom: map.getZoom() || prev.zoom,
        center: map.getCenter()?.toJSON() || prev.center,
      }));
    }
  }, [map]);

  const polylineIcons = useMemo(
    () =>
      showArrows
        ? [
            {
              icon: { path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
              offset: "0",
              repeat: "150px",
            },
          ]
        : [],
    [showArrows]
  );

  const renderPolylines = useMemo(() => {
    return polylines.map((polyline, index) => (
      <React.Fragment key={index}>
        <Polyline
          path={polyline.path}
          options={{
            strokeColor: polyline.color,
            strokeOpacity: 1,
            strokeWeight: 2,
            icons: polylineIcons,
          }}
        />
        {polyline.markers.map((marker, markerIndex) => (
          <Marker
            key={markerIndex}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`\
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">\
                  <circle cx="25" cy="25" r="6" fill="${polyline.color}" />\
                  <text x="25" y="15" text-anchor="middle" font-size="14" font-family="Arial" font-weight="bold" fill="${polyline.color}">\
                    ${
                      marker.time >= 60
                        ? `${Math.floor(marker.time / 60)}h ${marker.time % 60}m`
                        : `${marker.time}m`
                    }\
                  </text>\
                </svg>`)}\
              `,
              scaledSize: new window.google.maps.Size(50, 50),
              anchor: new window.google.maps.Point(25, 25),
            }}
          />
        ))}
      </React.Fragment>
    ));
  }, [polylines, polylineIcons]);

  return (
    <div className="Map">
      <LoadScript googleMapsApiKey={`${process.env.REACT_APP_MAPS_API_KEY}`}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapState.center}
          zoom={mapState.zoom}
          onLoad={handleMapLoad}
          onIdle={handleMapIdle}
        >
          {renderPolylines}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default React.memo(Map);