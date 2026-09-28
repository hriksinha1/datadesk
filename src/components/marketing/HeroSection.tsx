import { ArrowDownRight, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PreviewToday from './preview/PreviewToday';
import Reveal from './Reveal';

export default function HeroSection() {
  const { user, quickDemoAccess } = useAuth();
  const navigate = useNavigate();

  const openSample = async () => {
    if (!user) await quickDemoAccess();
    navigate('/app');
  };

  return (
    <section id="hero" className="mk-hero" aria-labelledby="hero-title">
      <div className="mk-shell mk-hero-shell">
        <div className="mk-hero-copy">
          <p className="mk-hero-context"><span>08:30</span> · For people who run real properties</p>
          <h1 id="hero-title">Know who’s arriving, who owes, and which room is free.</h1>
          <p className="mk-hero-lead">Bookings, payments and rooms in one clear view, for independent hotels, homestays and hostels.</p>
          <div className="mk-hero-actions">
            <Link className="mk-button-primary" to={user ? '/app' : '/signup'}>{user ? 'Open workspace' : 'Create your workspace'}<ArrowRight size={17} aria-hidden="true" /></Link>
            <button type="button" className="mk-button-quiet" onClick={openSample}>Open the sample workspace</button>
          </div>
          <p className="mk-hero-note">Sample data shown below <span aria-hidden="true">·</span> No account needed to look around</p>
        </div>
        <Reveal className="mk-hero-product" delay={0.12}><PreviewToday /></Reveal>
        <a className="mk-hero-scroll" href="#morning"><span>See the day come together</span><ArrowDownRight size={16} aria-hidden="true" /></a>
      </div>
      <div className="mk-tape-rule" aria-hidden="true"><i /><i /><b /><i /><i /></div>
    </section>
  );
}
