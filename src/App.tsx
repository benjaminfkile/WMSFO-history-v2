import React, { useState, useEffect, useRef } from "react";
import Map from "./Map";
import Menu from "./Menu";
import { Button } from "react-bootstrap";

type Location = {
  lat: number;
  lng: number;
};

type Marker = {
  lat: number;
  lng: number;
  time: number;
};

type FileConfig = {
  year: string;
  filePath: string;
  color: string;
};

const App: React.FC = () => {
  const [locations, setLocations] = useState<
    {
      year: string;
      path: Location[];
      color: string;
      markers: Marker[];
    }[]
  >([]);
  const [enabledYears, setEnabledYears] = useState<string[]>([]);
  const [intervalMinutes, setIntervalMinutes] = useState(10);
  const [initialized, setInitialized] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showMarkers, setShowMarkers] = useState(false);
  const [showArrows, setShowArrows] = useState(false);

  const menuButtonRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        const files: FileConfig[] = [
          { year: "2024", filePath: "/2024-tblTracker.json", color: "brown" }
        ];
  
        const allData = await Promise.all(
          files.map(async (file) => {
            const response = await fetch(file.filePath);
            const json = await response.json();
  
            const tableData = json.data || [];  // Adjust based on the structure of your data
            
            const path = tableData
              .map((entry: any) => ({
                lat: parseFloat(entry.lat),  // Convert lat and lon to float
                lng: parseFloat(entry.lon),
                time: parseInt(entry.time, 10), // Ensure time is in integer format (milliseconds)
              }))
              .filter(
                (location: Location) =>
                  !isNaN(location.lat) &&
                  !isNaN(location.lng) &&
                  location.lat !== 0 &&
                  location.lng !== 0
              );
  
            if (path.length === 0) {
              return {
                year: file.year,
                path: [],
                color: file.color,
                markers: [],
              };
            }
  
            const firstTime = path[0].time;
            const markers = showMarkers
              //@ts-ignore
              ? path.reduce<Marker[]>((acc, location) => {
                  const elapsedMinutes = (location.time - firstTime) / 60000;
                  if (elapsedMinutes >= acc.length * intervalMinutes) {
                    acc.push({
                      lat: location.lat,
                      lng: location.lng,
                      time: Math.floor(elapsedMinutes),
                    });
                  }
                  return acc;
                }, [])
              : [];
  
            return { year: file.year, path, color: file.color, markers };
          })
        );
  
        setLocations(allData);
  
        if (!initialized) {
          setEnabledYears(files.map((file) => file.year));
          setInitialized(true);
        }
      } catch (error) {
        console.error("Error loading or processing JSON:", error);
      }
    };
  
    fetchAndProcessData();
  }, [intervalMinutes, showMarkers, showArrows, initialized]);
  

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setShowMenu(false); // Close menu when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleYear = (year: string) => {
    setEnabledYears((prev) =>
      prev.includes(year) ? prev.filter((y) => y !== year) : [...prev, year]
    );
  };

  return (
    <div className="App">
      <div className="AppHeader">
        {showMenu && (
          <Menu
            ref={menuRef}
            setShowMenu={setShowMenu}
            showMarkers={showMarkers}
            setShowMarkers={setShowMarkers}
            showArrows={showArrows}
            setShowArrows={setShowArrows}
            intervalMinutes={intervalMinutes}
            setIntervalMinutes={setIntervalMinutes}
          />
        )}
        <div className="AppHeaderFlexItem">
          {locations.map((location) => (
            <React.Fragment key={location.year}>
              <Button
                className="YearBtn"
                onClick={() => toggleYear(location.year)}
                style={{
                  backgroundColor: enabledYears.includes(location.year)
                    ? location.color
                    : "gray",
                }}
              >
                {location.year}
              </Button>
            </React.Fragment>
          ))}
        </div>
        <div className="AppHeaderFlexItem AppHeaderFlexItemInterval">
          <div
            id="ebcf8b1-7d16-4b23-bc6d-6d4aadcd6921"
            ref={menuButtonRef}
            onClick={() => setShowMenu((prev) => !prev)}
          >
            <span
              id="ade1973-07b7-4b9f-8b2b-1460474e82fa"
              className="material-symbols-outlined"
            >
              Menu
            </span>
          </div>
        </div>
      </div>
      <Map
        polylines={locations.filter((location) =>
          enabledYears.includes(location.year)
        )}
        showArrows={showArrows}
      />
    </div>
  );
};

export default App;