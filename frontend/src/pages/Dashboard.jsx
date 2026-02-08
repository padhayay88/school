import React, { useEffect, useMemo, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from "chart.js";
import PageLayout from "../components/PageLayout.jsx";
import Topbar from "../components/Topbar.jsx";
import StatCard from "../components/StatCard.jsx";
import api from "../api";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler, Legend);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, monthlyRes] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/monthly-fees"),
        ]);
        setSummary(summaryRes.data);
        setMonthly(monthlyRes.data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
        // Set default empty data
        setSummary({ students: 0, teachers: 0, totalFeesCollected: 0, totalPendingFees: 0 });
        setMonthly([]);
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dataByMonth = Array(12).fill(0);
    monthly.forEach(item => {
      if(item._id) {
        dataByMonth[item._id - 1] = item.total;
      }
    });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Monthly Collection",
          data: dataByMonth,
          fill: true,
          borderColor: "#0a1f44",
          backgroundColor: "rgba(244, 180, 0, 0.25)",
          tension: 0.35,
        },
      ],
    };
  }, [monthly]);

  return (
    <PageLayout>
      {/* Hero Section with School Image */}
      <div style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1427504494785-cdcd02d457a0?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "16px",
        overflow: "hidden",
        marginBottom: 32,
        height: "280px",
        position: "relative",
        display: "flex",
        alignItems: "flex-end",
      }}>
        {/* Overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(10, 31, 68, 0.3) 0%, rgba(10, 31, 68, 0.7) 100%)",
        }}></div>
        
        {/* Header Content */}
        <div style={{
          position: "relative",
          zIndex: 20,
          padding: "32px 24px",
          color: "white",
          width: "100%",
        }}>
          <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>
            Unique English Boarding School
          </h1>
          <p style={{ margin: 0, fontSize: "1rem", opacity: 0.95 }}>
            Principal: Kumkum Upadhyay
          </p>
        </div>
      </div>

      <Topbar title="Dashboard Overview" />
      
      <div className="card-grid">
        <StatCard title="Total Students" value={summary?.students ?? "--"} />
        <StatCard title="Total Teachers" value={summary?.teachers ?? "--"} />
        <StatCard
          title="Total Collection"
          value={`Rs ${summary?.totalFeesCollected ?? "--"}`}
        />
        <StatCard
          title="Pending Fees"
          value={`Rs ${summary?.totalPendingFees ?? "--"}`}
        />
      </div>

      <div className="card">
        <h3 style={{ marginTop: 0 }}>Fee Collection Overview</h3>
        <Line data={chartData} options={{ maintainAspectRatio: true }} />
      </div>
    </PageLayout>
  );
};

export default Dashboard;
