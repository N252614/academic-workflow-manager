function AlertBanner({ message }) {
  // Do not show anything if there is no message
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
      {/* Show alert message */}
      {message}
    </div>
  );
}

export default AlertBanner;