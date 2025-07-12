"use client";
import { useState, useEffect } from "react";
import useAvatar from "@/app/custom-components/navbar/avatarStore";
import Peep from "react-peeps";

export function PeepAvatar() {
  // Get Values for peeps from useAvatar
  const accessory = useAvatar((state) => state.accessory);
  const body = useAvatar((state) => state.body);
  const face = useAvatar((state) => state.face);
  const hair = useAvatar((state) => state.hair);
  const facialHair = useAvatar((state) => state.facialHair);

  const [dimensions, setDimensions] = useState({
    peepSize: 300,
    circleSize: 270,
    borderRadius: 135,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the component only updates after hydration
    setIsClient(true);

    const updateDimensions = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setDimensions({
          peepSize: 200,
          circleSize: 180,
          borderRadius: 90,
        });
      } else if (width < 768) {
        setDimensions({
          peepSize: 250,
          circleSize: 220,
          borderRadius: 110,
        });
      } else {
        setDimensions({
          peepSize: 300,
          circleSize: 270,
          borderRadius: 135,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Use default dimensions during SSR to prevent hydration mismatch
  const currentDimensions = isClient
    ? dimensions
    : {
        peepSize: 300,
        circleSize: 270,
        borderRadius: 135,
      };

  const styles = {
    peepStyle: {
      width: currentDimensions.peepSize,
      height: currentDimensions.peepSize,
      justifyContent: "center",
      alignSelf: "center",
    },
    circleStyle: {
      backgroundColor: "#F3D34A",
      width: currentDimensions.circleSize,
      height: currentDimensions.circleSize,
      alignSelf: "center",
      borderRadius: currentDimensions.borderRadius,
      overflow: "hidden",
      borderWidth: 4,
      borderColor: "grey",
      borderStyle: "solid",
    },
    showcaseWrapper: {
      display: "flex",
      justifyContent: "center",
      height: "auto",
      minHeight: `${currentDimensions.peepSize}px`,
    },
  };

  return (
    <div style={styles.showcaseWrapper}>
      <Peep
        style={styles.peepStyle}
        circleStyle={styles.circleStyle}
        accessory={accessory}
        body={body}
        face={face}
        hair={hair}
        facialHair={facialHair}
        strokeColor=""
        viewBox={{ x: "0", y: "0", width: "1050", height: "1200" }}
      ></Peep>
    </div>
  );
}
