import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";

interface MapComponentProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number, address: string) => void;
  isEditable: boolean;
}

const Maps: React.FC<MapComponentProps> = ({
  lat,
  lng,
  onLocationChange,
  isEditable,
}) => {
  const [location, setLocation] = useState({ lat, lng });
  const [address, setAddress] = useState<string>("");

  // Get current geolocation
  const getCurrentCityLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              const cityAddress = data.address.city || data.display_name;
              setAddress(cityAddress);
              onLocationChange(latitude, longitude, cityAddress);
            })
            .catch((err) => {
              console.error("Error fetching city address:", err);
              setAddress("Unable to fetch address");
            });
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocation({ lat: 51.505, lng: -0.09 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      setLocation({ lat: 51.505, lng: -0.09 });
    }
  };

 const SearchControl = () => {
   const map = useMap();
   const provider = new OpenStreetMapProvider();

   useEffect(() => {
     const searchControl = new (GeoSearchControl as any)({
       provider,
       style: "bar",
       autoClose: true,
       keepResult: true,
     });

     map.addControl(searchControl);

     return () => {
       map.removeControl(searchControl);
     };
   }, [map, provider]); 

   return null;
 };

  const LocationMarker = () => {
    const map = useMap();

    useMapEvents({
      click(e) {
        if (isEditable) {
          const { lat, lng } = e.latlng;
          setLocation({ lat, lng });

          fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          )
            .then((res) => res.json())
            .then((data) => {
              const selectedAddress =
                data.display_name || "No address available";
              setAddress(selectedAddress);
              onLocationChange(lat, lng, selectedAddress);
            })
            .catch((err) => {
              console.error("Error fetching address:", err);
              setAddress("Unable to fetch address");
            });

          map.flyTo([lat, lng], 13, {
            animate: true,
            duration: 1,
          });
        }
      },
    });

    const icon = new L.Icon({
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      iconSize: [32, 48],
      iconAnchor: [16, 48],
      popupAnchor: [0, -48],
    });

    return (
      <Marker position={[location.lat, location.lng]} icon={icon}>
        <Popup>{address || "No address selected"}</Popup>
      </Marker>
    );
  };

  // Trigger map zoom to current location once the position is fetched
  const MapZoomToLocation = () => {
    const map = useMap();
    useEffect(() => {
      if (location.lat && location.lng) {
        map.flyTo([location.lat, location.lng], 13, {
          animate: true,
          duration: 1,
        });
      }
    }, [location, map]);

    return null;
  };

  useEffect(() => {
    getCurrentCityLocation();
  }, []);

  return (
    <div className="w-full h-[400px] sm:h-[500px] rounded-lg shadow-lg overflow-hidden">
      <MapContainer
        center={[location.lat, location.lng]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%" }}
        className="rounded-lg"
      >
        <TileLayer
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <SearchControl />
        <LocationMarker />
        <MapZoomToLocation />
      </MapContainer>

      <div className="mt-4 text-center text-sm text-gray-600">
        <p>{address ? address : "Click on the map to select your address"}</p>
      </div>

      {isEditable && (
        <div className="text-center mt-4">
          <button
            onClick={getCurrentCityLocation}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Use Current Location
          </button>
        </div>
      )}
    </div>
  );
};

export default Maps;
