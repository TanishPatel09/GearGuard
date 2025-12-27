import '../App.css'

function StyleGuide() {
  return (
    <div className="min-h-screen p-10 font-sans">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">Style Guide</h1>
          <p className="text-text-sub">Odoo-style Design System for GearGuard</p>
        </div>

        {/* Section: Colors */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">Colors</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorCard name="Background" hex="#F5F5F5" bg="bg-background" text="text-text-main" border />
            <ColorCard name="Surface" hex="#FFFFFF" bg="bg-surface" text="text-text-main" border />
            <ColorCard name="Text Main" hex="#1F2937" bg="bg-text-main" text="text-white" />
            <ColorCard name="Text Sub" hex="#6B7280" bg="bg-text-sub" text="text-white" />
          </div>

          <h3 className="text-lg font-medium mt-6">Primary Accent</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ColorCard name="Primary" hex="#714B67" bg="bg-primary" text="text-white" />
            <ColorCard name="Primary Hover" hex="#5E3E55" bg="bg-primary-hover" text="text-white" />
            <ColorCard name="Primary Subtle" hex="#F2EAF0" bg="bg-primary-subtle" text="text-primary" />
          </div>

          <h3 className="text-lg font-medium mt-6">Status Colors</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatusCard label="New" text="text-status-new-text" bg="bg-status-new-bg" hexText="#2563EB" hexBg="#EFF6FF" />
            <StatusCard label="In Progress" text="text-status-progress-text" bg="bg-status-progress-bg" hexText="#D97706" hexBg="#FFFBEB" />
            <StatusCard label="Repaired" text="text-status-repaired-text" bg="bg-status-repaired-bg" hexText="#15803D" hexBg="#ECFDF5" />
            <StatusCard label="Overdue / Scrap" text="text-status-danger-text" bg="bg-status-danger-bg" hexText="#B91C1C" hexBg="#FEF2F2" />
          </div>
        </section>

        {/* Section: Typography & UI Elements */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">UI Elements</h2>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Buttons */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Buttons</h3>
              <div className="flex flex-wrap gap-4 items-center">
                <button className="px-4 py-2 rounded bg-primary text-white hover:bg-primary-hover transition-colors cursor-pointer shadow-sm font-medium">
                  Primary Button
                </button>
                <button className="px-4 py-2 rounded bg-surface border border-border text-text-main hover:bg-gray-50 transition-colors cursor-pointer shadow-sm font-medium">
                  Secondary Button
                </button>
                <button className="px-4 py-2 rounded bg-status-danger-text text-white hover:opacity-90 transition-opacity cursor-pointer shadow-sm font-medium">
                  Danger Button
                </button>
              </div>
            </div>

            {/* Badges */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Status Badges</h3>
              <div className="flex flex-wrap gap-3">
                <Badge label="New" text="text-status-new-text" bg="bg-status-new-bg" />
                <Badge label="In Progress" text="text-status-progress-text" bg="bg-status-progress-bg" />
                <Badge label="Repaired" text="text-status-repaired-text" bg="bg-status-repaired-bg" />
                <Badge label="Scrap" text="text-status-danger-text" bg="bg-status-danger-bg" />
              </div>
            </div>

          </div>
        </section>

        {/* Section: Cards */}
        <section className="space-y-4">
           <h2 className="text-2xl font-semibold border-b border-border pb-2">Card Example</h2>
           <div className="p-6 rounded-lg bg-surface border border-border shadow-sm max-w-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-text-main">Order #12345</h3>
                <Badge label="In Progress" text="text-status-progress-text" bg="bg-status-progress-bg" />
              </div>
              <p className="text-text-sub mb-6">
                This is an example card component using the surface color and border color. 
                It demonstrates readability on the light gray background.
              </p>
              <div className="flex gap-2">
                 <button className="px-3 py-1.5 rounded bg-primary text-white text-sm hover:bg-primary-hover transition-colors font-medium">
                  View Details
                </button>
              </div>
           </div>
        </section>

      </div>
    </div>
  )
}

// Helper Components for the Style Guide

function ColorCard({ name, hex, bg, text, border }) {
  return (
    <div className={`p-4 rounded-lg ${bg} ${text} ${border ? 'border border-border' : ''} flex flex-col justify-between h-24 shadow-sm`}>
      <span className="font-semibold">{name}</span>
      <span className="text-sm opacity-80">{hex}</span>
    </div>
  )
}

function StatusCard({ label, text, bg, hexText, hexBg }) {
  return (
    <div className={`p-4 rounded-lg ${bg} border border-transparent`}>
      <span className={`font-bold block mb-1 ${text}`}>{label}</span>
      <div className="text-xs text-text-sub">
        <div>T: {hexText}</div>
        <div>B: {hexBg}</div>
      </div>
    </div>
  )
}

function Badge({ label, text, bg }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${text} ${bg}`}>
      {label}
    </span>
  )
}

export default StyleGuide
