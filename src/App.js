import { BrowserRouter, Routes, Route } from "react-router-dom";
import VendorDashboard from "./pages/VendorDashboard";
import BulkGroupsPage from "./pages/BulkGroups";
import ProfilePage from "./pages/ProfilePage";
import StorageCard from "./pages/StorageCard";
import BrowseProducts from "./pages/BrowseProducts";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/vendor/dashboard" element={<VendorDashboard />} />
        <Route path="/bulk-groups" element={<BulkGroupsPage />} />
        <Route path="*" element={<VendorDashboard />} />
        <Route path="/storage" element={<StorageCard />} />
        <Route path="/vendor/profile/:vendorId" element={<ProfilePage />} />
        <Route path="/browse-products" element={<BrowseProducts />} />
      </Routes>
    </BrowserRouter>
  );
}
