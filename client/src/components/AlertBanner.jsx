function AlertBanner({ message }) {
  if (!message) return null;

  return (
    <div
      style={{
        marginBottom: "20px",
        padding: "10px",
        border: "1px solid red",
        color: "red",
        fontWeight: "bold",
      }}
    >
      {message}
    </div>
  );
}

export default AlertBanner;