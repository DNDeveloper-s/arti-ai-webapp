export default function FeatureRecord() {
  return (
    <div className="landing-page-section w-full h-[400px] flex items-center justify-center">
      <div
        style={{
          border: "2px solid #ffffff3d",
          zIndex: 29,
          borderRadius: "10px",
          marginTop: "-230px",
          overflow: "hidden",
          display: "block",
          boxShadow:
            "rgb(227 227 227 / 9%) 0px 8px 24px, rgb(255 255 255 / 15%) 0px 16px 56px, rgb(255 255 255 / 12%) 0px 24px 80px",
        }}
      >
        <video autoPlay muted loop>
          <source src="/videos/feature-record.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
