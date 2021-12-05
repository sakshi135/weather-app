const GoogleMap = ({ lat, long, city }) => {
  return (
    <iframe
      width="600"
      height="450"
      loading="lazy"
      allowfullscreen
      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyAG_LJJgemnB-1rcZNbnR8cYeXuhUe2pGs&q=${city}&center=${lat},${long}
        `}
    ></iframe>
  );
};
export default GoogleMap;
