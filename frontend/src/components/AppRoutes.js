import React, { Suspense, lazy } from 'react';
import { Routes, Route, createBrowserRouter } from 'react-router-dom';

// Lazy load all components
const WelcomePage = lazy(() => import("./WelcomePage.jsx"));
const UserAuth = lazy(() => import("../user/UserAuth"));
const UserMainPage = lazy(() => import("../user/usermainpage"));
const NearbyHospital = lazy(() => import("../user/NearbyHospital"));
const DonateBlood = lazy(() => import("../user/DonateBlood"));
const RequestBlood = lazy(() => import("../user/RequestBlood"));
const Admin = lazy(() => import("./utility/Admin"));
const Staff = lazy(() => import("./utility/Staff"));
const About = lazy(() => import("./utility/About"));
const Contact = lazy(() => import("./utility/Contact"));
const FAQ = lazy(() => import("./utility/FAQ"));
const HowItWorks = lazy(() => import("./utility/HowItWorks"));

const LoadingSpinner = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
    <div className="spinner-border text-danger" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Suspense fallback={<LoadingSpinner />}><WelcomePage /></Suspense>
    },
    {
      path: "/admin",
      element: <Suspense fallback={<LoadingSpinner />}><Admin /></Suspense>
    },
    {
      path: "/donate-blood",
      element: <Suspense fallback={<LoadingSpinner />}><DonateBlood /></Suspense>
    },
    {
      path: "/request-blood",
      element: <Suspense fallback={<LoadingSpinner />}><RequestBlood /></Suspense>
    },
    {
      path: "/staff",
      element: <Suspense fallback={<LoadingSpinner />}><Staff /></Suspense>
    },
    {
      path: "/user",
      element: <Suspense fallback={<LoadingSpinner />}><UserAuth /></Suspense>
    },
    {
      path: "/user/usermainpage",
      element: <Suspense fallback={<LoadingSpinner />}><UserMainPage /></Suspense>
    },
    {
      path: "/about",
      element: <Suspense fallback={<LoadingSpinner />}><About /></Suspense>
    },
    {
      path: "/how-it-works",
      element: <Suspense fallback={<LoadingSpinner />}><HowItWorks /></Suspense>
    },
    {
      path: "/faq",
      element: <Suspense fallback={<LoadingSpinner />}><FAQ /></Suspense>
    },
    {
      path: "/contact",
      element: <Suspense fallback={<LoadingSpinner />}><Contact /></Suspense>
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/donate-blood" element={<DonateBlood />} />
        <Route path="/request-blood" element={<RequestBlood />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/user" element={<UserAuth />} />
        <Route path="/user/usermainpage" element={<UserMainPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/user/nearbyhospital" element={<NearbyHospital />} />
      </Routes>
    </Suspense>
  );
};

export { router };
export default AppRoutes;
