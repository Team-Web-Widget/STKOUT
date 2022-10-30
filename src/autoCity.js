export const fetchPlace = async (text) => {
    try {
      const res = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${text}.json?access_token=pk.eyJ1IjoiZWxkcmJyZWFrIiwiYSI6ImNsOXVqOXV1czB2NmEzbnM1anR2MjVyMmIifQ.iwVbJakYj-HSpfYch-WNOw&cachebuster=1625641871908&autocomplete=true&types=place`
      );
      if (!res.ok) throw new Error(res.statusText);
      return res.json();
    } catch (err) {
      return { error: "Unable to retrieve places" };
    }
  };