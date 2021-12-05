const FxItem = ({ fxSymbol, fxRate, ratesBase }) => {
  return (
    <div>
      <strong>
        {fxSymbol}/{ratesBase}
      </strong>
      <span>{fxRate}</span>
    </div>
  );
};

export default FxItem;
