import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import SampleWorkspaceAction from './SampleWorkspaceAction';

export default function MarketingFooter() {
  return <footer className="mk-footer"><div className="mk-shell mk-footer-top"><div className="mk-footer-brand"><Link to="/" className="mk-brand mk-brand-on-dark" aria-label="MyTrackYo home"><BrandMark size={32} /><span>MyTrackYo</span></Link><p>Clarity for people who run real properties.</p></div>
    <div className="mk-footer-column"><h2>Product</h2><a href="#today">Today</a><a href="#bookings">Bookings</a><a href="#calendar">Calendar</a><a href="#payments">Payments</a><a href="#portfolio">Multiple properties</a></div>
    <div className="mk-footer-column"><h2>For your property</h2><a href="#use-cases">Hotels</a><a href="#use-cases">Homestays & lodges</a><a href="#use-cases">Hostels & dorms</a></div>
    <div className="mk-footer-column"><h2>Workspace</h2><Link to="/login">Log in</Link><Link to="/signup">Create a workspace</Link><SampleWorkspaceAction className="mk-footer-action" label="Open sample workspace" /></div>
  </div><div className="mk-shell mk-footer-bottom"><span>© {new Date().getFullYear()} MyTrackYo</span><span>Sample workspace data is stored in this browser.</span></div></footer>;
}
