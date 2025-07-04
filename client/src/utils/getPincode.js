import { toast } from "react-toastify";

export const getPincode = async () => {
  const token = import.meta.env.VITE_LOCATIONIQ_TOKEN;

  if (!token) {
    throw new Error("LocationIQ token is missing");
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser.");
      reject("Geolocation not supported.");
    } else {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const res = await fetch(
              `https://us1.locationiq.com/v1/reverse?key=${token}&lat=${latitude}&lon=${longitude}&format=json`
            );

            const data = await res.json();

            const pincode = data.address.postcode || "Unknown";
            resolve(pincode);
          } catch (err) {
            console.error("API Fetch error:", err);
            toast.error("Failed to fetch pincode from LocationIQ API.");
            reject("Failed to fetch pincode from LocationIQ API.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);

          if (error.code === error.PERMISSION_DENIED) {
            toast.info(
              "Location access denied.\n\n" +
              "To enable:\n" +
              "1. Click the lock icon near the URL bar.\n" +
              "2. Click 'Site Settings'.\n" +
              "3. Change Location permission to 'Allow'.\n" +
              "4. Refresh this page.\n\n" +
              "This is required to fetch your Indian pincode accurately.",
              { autoClose: 10000 }
            );
            reject("Location permission denied.");
          } else {
            toast.error("Unable to retrieve your location.");
            reject("Unable to retrieve your location.");
          }
        }
      );
    }
  });
};
