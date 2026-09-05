const TSR_DATA = {
  team: {
    name: "Team SJEC Racing",
    shortName: "TSR",
    tagline: "Engineered on the edge.",
    description: "The official off-road motorsport team of St Joseph Engineering College. Designing, fabricating, and racing all-terrain vehicles built to conquer national BAJA SAE tracks.",
    email: "team@sjecracing.in",
    location: "Mangaluru, Karnataka",
    social: "@sjecracing",
    heroImage: "img2.png",
    stats: [
      { value: "0–40", label: "3.2 SECONDS" },
      { value: "185", label: "KG DRY WEIGHT" },
      { value: "08", label: "SEASONS RACED" },
      { value: "45+", label: "ACTIVE MEMBERS" }
    ]
  },
  
  featuredCar: {
    model: "TSR-26 BAJA",
    type: "All-Terrain Vehicle",
    image: "img1.png",
    specs: [
      { label: "Chassis", value: "Chromoly AISI 4130 Tubular Spaceframe" },
      { label: "Engine", value: "Briggs & Stratton 10HP Vanguard" },
      { label: "Transmission", value: "Custom Tuned CVT with 2-Stage Reduction" },
      { label: "Suspension", value: "Front Double A-Arm / Rear Custom Trailing Arm" },
      { label: "Braking", value: "TMC 4-Wheel Hydraulic Disc with Bias Bar" }
    ]
  },

  members: [
    {
      name: "Captain Name",
      role: "Team Captain",
      subteam: "Management & Chassis",
      bio: "Leads vehicle layout, overall vehicle dynamics testing, and seasonal timeline."
    },
    {
      name: "Driver Name",
      role: "Primary Driver",
      subteam: "Vehicle Dynamics",
      bio: "Over 200 track testing hours. Specializes in dynamic maneuverability and rock-crawl setups."
    },
    {
      name: "Tech Lead",
      role: "Technical Director",
      subteam: "Powertrain & Drivetrain",
      bio: "Oversees CVT calibration, thermal dissipation, and custom gearbox fabrication."
    }
  ],

  gallery: [
    { title: "Tech Inspection Lineup", caption: "Car E04 cleared through roll cage audit", image: "img1.png" },
    { title: "Dynamic Brake Test", caption: "M09 kicking up dust on the endurance run", image: "img2.png" },
    { title: "Pit Lane Ready", caption: "Final grid check before track roll-out", image: "img3.png" }
  ]
};
