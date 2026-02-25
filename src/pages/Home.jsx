import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 py-20 overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        <div className="mb-6 animate-fade-in">
          <img src="/logo.png" alt="Shield Logo" className="w-[300px] drop-shadow-2xl" />
        </div>

        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
          Silent Shield
        </h1>
        <h2 className="text-2xl md:text-3xl font-medium text-brand-accent/90 mb-8 tracking-wide">
          Anonymous Cyberbullying Reporting Portal
        </h2>

        <p className="text-xl text-gray-300 mb-12 leading-relaxed max-w-2xl opacity-90">
          We provide a secure, encrypted, and completely anonymous platform for students to report cyberbullying without fear.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-20">
          <Link to="/report" className="btn-primary min-w-[220px] text-center">
            Report a Bully
          </Link>
          <Link to="/track" className="btn-primary min-w-[220px] text-center">
            Track Your Report
          </Link>
          <Link to="/admin-login" className="btn-primary min-w-[220px] text-center">
            Staff Login
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-6xl relative z-10">
        {[
          { img: "/lock.png", title: "100% Anonymous", desc: "No personal data is ever tracked or stored." },
          { img: "/chat.png", title: "Instant Action", desc: "Reports are reviewed immediately by authorized staff." },
          { img: "/people.png", title: "Safe Community", desc: "Together we can end cyberbullying in our schools." }
        ].map((f, i) => (
          <div key={i} className="glass-card p-8 flex flex-col items-center text-center group hover:border-brand-accent/30 transition-all duration-500">
            <img src={f.img} alt={f.title} className="w-24 mb-6 group-hover:scale-110 transition-transform duration-500" />
            <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
            <p className="text-gray-400 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
      
      {/* Background Decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-primary/20 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-secondary/10 blur-[150px] rounded-full"></div>
    </div>
  );
};

export default Home;
