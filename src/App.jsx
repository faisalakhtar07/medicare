import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import BottomNav from './components/BottomNav.jsx'

import Home from './pages/Home.jsx'
import ProductListing from './pages/ProductListing.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import PrescriptionUpload from './pages/PrescriptionUpload.jsx'
import LabTests from './pages/LabTests.jsx'
import LabTestDetail from './pages/LabTestDetail.jsx'
import Doctors from './pages/Doctors.jsx'
import DoctorDetail from './pages/DoctorDetail.jsx'
import Offers from './pages/Offers.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Profile from './pages/Profile.jsx'
import Orders from './pages/Orders.jsx'
import OrderTrack from './pages/OrderTrack.jsx'
import Wishlist from './pages/Wishlist.jsx'
import SearchResults from './pages/SearchResults.jsx'
import StaticPage from './pages/StaticPage.jsx'
import NotFound from './pages/NotFound.jsx'

function PageWrap({ children }) {
  const location = useLocation()
  return (
    <motion.div
      key={location.pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrap><Home /></PageWrap>} />
            <Route path="/medicines" element={<PageWrap><ProductListing title="Medicines" filterCategory={null} /></PageWrap>} />
            <Route path="/medicines/:id" element={<PageWrap><ProductDetail /></PageWrap>} />
            <Route path="/category/:slug" element={<PageWrap><ProductListing /></PageWrap>} />
            <Route path="/healthcare" element={<PageWrap><ProductListing title="Healthcare Products" filterCategory="devices" /></PageWrap>} />
            <Route path="/search" element={<PageWrap><SearchResults /></PageWrap>} />
            <Route path="/cart" element={<PageWrap><Cart /></PageWrap>} />
            <Route path="/checkout" element={<PageWrap><Checkout /></PageWrap>} />
            <Route path="/order-success" element={<PageWrap><OrderSuccess /></PageWrap>} />
            <Route path="/prescription" element={<PageWrap><PrescriptionUpload /></PageWrap>} />
            <Route path="/lab-tests" element={<PageWrap><LabTests /></PageWrap>} />
            <Route path="/lab-tests/:id" element={<PageWrap><LabTestDetail /></PageWrap>} />
            <Route path="/doctors" element={<PageWrap><Doctors /></PageWrap>} />
            <Route path="/doctors/:id" element={<PageWrap><DoctorDetail /></PageWrap>} />
            <Route path="/offers" element={<PageWrap><Offers /></PageWrap>} />
            <Route path="/login" element={<PageWrap><Login /></PageWrap>} />
            <Route path="/signup" element={<PageWrap><Signup /></PageWrap>} />
            <Route path="/profile" element={<PageWrap><Profile /></PageWrap>} />
            <Route path="/orders" element={<PageWrap><Orders /></PageWrap>} />
            <Route path="/orders/:id" element={<PageWrap><OrderTrack /></PageWrap>} />
            <Route path="/track-order/:id" element={<PageWrap><OrderTrack /></PageWrap>} />
            <Route path="/wishlist" element={<PageWrap><Wishlist /></PageWrap>} />
            <Route path="/about" element={<PageWrap><StaticPage type="about" /></PageWrap>} />
            <Route path="/contact" element={<PageWrap><StaticPage type="contact" /></PageWrap>} />
            <Route path="/faq" element={<PageWrap><StaticPage type="faq" /></PageWrap>} />
            <Route path="/privacy" element={<PageWrap><StaticPage type="privacy" /></PageWrap>} />
            <Route path="/terms" element={<PageWrap><StaticPage type="terms" /></PageWrap>} />
            <Route path="*" element={<PageWrap><NotFound /></PageWrap>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}
