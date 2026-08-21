import { useEffect } from 'react';

function Research() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const domains = [
    {
      title: "VLSI Design",
      icon: "memory",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      description: "[Placeholder: Details about Very Large Scale Integration research, chip design, and microelectronics projects.]"
    },
    {
      title: "Embedded Systems",
      icon: "developer_board",
      color: "text-green-500",
      bg: "bg-green-500/10",
      description: "[Placeholder: Information on embedded controllers, real-time operating systems, and hardware-software co-design.]"
    },
    {
      title: "Internet of Things (IoT)",
      icon: "wifi_tethering",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      description: "[Placeholder: Research into connected devices, sensor networks, smart automation, and IoT infrastructure.]"
    },
    {
      title: "Robotics & Automation",
      icon: "smart_toy",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      description: "[Placeholder: Exploration of robotic kinematics, autonomous navigation, and industrial automation solutions.]"
    }
  ];

  return (
    <div className="w-full bg-surface-container-lowest min-h-screen py-16 md:py-24">
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 fade-in-up">
          <h1 className="font-display-lg text-display-md md:text-display-lg font-bold text-on-surface mb-6">
            Research <span className="text-secondary">Areas</span>
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Explore the cutting-edge domains where our teams push the boundaries of modern technology.
          </p>
        </div>

        {/* Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {domains.map((domain, index) => (
            <div 
              key={index} 
              className="bg-surface-container-low rounded-3xl p-8 border border-surface-variant glass-effect hover-lift fade-in-up flex flex-col h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 ${domain.bg} rounded-2xl flex items-center justify-center ${domain.color} mb-6`}>
                <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {domain.icon}
                </span>
              </div>
              <h3 className="font-title-lg text-title-lg font-bold text-on-surface mb-3">
                {domain.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed flex-grow">
                {domain.description}
              </p>
              
              <div className="mt-6 pt-6 border-t border-surface-variant/50">
                <button className="text-primary font-label-lg font-bold uppercase tracking-wider flex items-center gap-2 hover:text-primary-dark transition-colors group">
                  Learn More 
                  <span className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Research;
