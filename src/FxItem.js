import "./FxItem.css";
const FxItem = ({ fxSymbol, fxRate, ratesBase }) => {
  return (
    <div className="FxItem">
      <div>
        <h3>
          {fxSymbol}/{ratesBase}
        </h3>
      </div>
      <div>
        <h3>{fxRate}</h3>
      </div>
    </div>
  );
};

export default FxItem;
