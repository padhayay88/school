import { useEffect, useState } from "react";
import axios from "../api";

export default function MobileToggle() {
  const [mobile, setMobile] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios.get("/mobile-version").then(r => {
      setMobile(!!r.data.mobileVersion);
    });
  }, []);

  const handleToggle = async () => {
    setLoading(true);
    await axios.post("/mobile-version", { enabled: !mobile });
    setMobile(!mobile);
    setLoading(false);
    window.location.reload(); // reload to apply UI changes if needed
  };

  return (
    <div style={{ margin: 16 }}>
      <button onClick={handleToggle} disabled={loading} style={{ padding: 8, fontSize: 16 }}>
        {mobile ? "Switch to Desktop Version" : "Switch to Mobile Version"}
      </button>
    </div>
  );
}
