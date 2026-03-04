const mongoose = require('mongoose');
const { Job, FeaturedJob } = require('./models');
require('dotenv').config();

// ── Latest Jobs (shown in "Latest jobs open" section) ─────────────────────
const seedJobs = [
  {
    title: 'Social Media Assistant',
    company: 'Nomad',
    location: 'Paris, France',
    category: 'Marketing',
    description:
      'Nomad is looking for a Social Media Assistant to join our growing marketing team. You will help create and manage social media content, engage with our community, and support campaigns that drive brand awareness across all platforms.',
  },
  {
    title: 'Social Media Assistant',
    company: 'Netlify',
    location: 'Paris, France',
    category: 'Marketing',
    description:
      'Netlify is looking for a Social Media Assistant to help us build our brand presence. You will work alongside our marketing team to schedule content, respond to community questions, and analyse social engagement metrics.',
  },
  {
    title: 'Brand Designer',
    company: 'Dropbox',
    location: 'San Fransisco, USA',
    category: 'Design',
    description:
      'Dropbox is looking for a Brand Designer to craft visual identities and design systems that resonate with millions of users worldwide. You will collaborate with product, marketing, and leadership teams to evolve the Dropbox brand.',
  },
  {
    title: 'Brand Designer',
    company: 'Maze',
    location: 'San Fransisco, USA',
    category: 'Design',
    description:
      'Maze is looking for a Brand Designer to help shape the visual language of our platform. You will design across digital and print touchpoints and ensure a consistent, compelling brand experience for our users.',
  },
  {
    title: 'Interactive Developer',
    company: 'Terraform',
    location: 'Hamburg, Germany',
    category: 'Technology',
    description:
      'Terraform is looking for an Interactive Developer to build immersive web experiences. You will work with creative directors and designers to bring ambitious digital concepts to life using cutting-edge frontend technologies.',
  },
  {
    title: 'Interactive Developer',
    company: 'Udacity',
    location: 'Hamburg, Germany',
    category: 'Technology',
    description:
      'Udacity is looking for an Interactive Developer to create engaging learning experiences for our students. You will develop interactive exercises, simulations, and tools that make complex technical subjects approachable and fun.',
  },
  {
    title: 'HR Manager',
    company: 'Packer',
    location: 'Lucern, Switzerland',
    category: 'Human Resource',
    description:
      'Packer is looking for an HR Manager to lead people operations across our engineering-focused team. You will oversee recruiting, onboarding, employee relations, and HR policy to support a world-class remote-first culture.',
  },
  {
    title: 'HR Manager',
    company: 'Webflow',
    location: 'Lucern, Switzerland',
    category: 'Human Resource',
    description:
      'Webflow is looking for an HR Manager to help scale our team responsibly. You will partner with leadership to develop talent strategies, manage the full employee lifecycle, and foster an inclusive, high-performance workplace.',
  },
];

// ── Featured Jobs (shown in "Featured jobs" section) ──────────────────────
const seedFeaturedJobs = [
  {
    title: 'Email Marketing',
    company: 'Revolut',
    location: 'Madrid, Spain',
    description:
      'Revolut is looking for Email Marketing to help team manage and grow its email marketing campaigns across Europe and beyond.',
    categories: ['Marketing', 'Design'],
    logo: 'R',
  },
  {
    title: 'Brand Designer',
    company: 'Dropbox',
    location: 'San Fransisco, US',
    description:
      'Dropbox is looking for Brand Designer to help the team translate brand values into world-class visual design and experiences.',
    categories: ['Design', 'Business'],
    logo: 'D',
  },
  {
    title: 'Email Marketing',
    company: 'Pitch',
    location: 'Berlin, Germany',
    description:
      'Pitch is looking for Customer Manager to join marketing team and own email relationship with its growing global user base.',
    categories: ['Marketing'],
    logo: 'P',
  },
  {
    title: 'Visual Designer',
    company: 'Blinklist',
    location: 'Granada, Spain',
    description:
      'Blinklist is looking for Visual Designer to help team design beautiful and intuitive reading experiences for its platform.',
    categories: ['Design'],
    logo: 'B',
  },
  {
    title: 'Product Designer',
    company: 'ClassPass',
    location: 'Manchester, UK',
    description:
      'ClassPass is looking for Product Designer to help define and deliver the next generation of fitness and wellness experiences.',
    categories: ['Marketing', 'Design'],
    logo: 'C',
  },
  {
    title: 'Lead Designer',
    company: 'Canva',
    location: 'Ontario, Canada',
    description:
      'Canva is looking for Lead Engineer to help develop new design tools and features that empower millions of creators worldwide.',
    categories: ['Design', 'Business'],
    logo: 'Ca',
  },
  {
    title: 'Brand Strategist',
    company: 'GoDaddy',
    location: 'Marseille, France',
    description:
      'GoDaddy is looking for Brand Strategist to join the team and help shape the company narrative for small business owners globally.',
    categories: ['Marketing'],
    logo: 'G',
  },
  {
    title: 'Data Analyst',
    company: 'Twitter',
    location: 'San Diego, US',
    description:
      'Twitter is looking for Data Analyst to help team design reports and surfaces insights that drive key product and business decisions.',
    categories: ['Technology'],
    logo: 'T',
  },
];

// ── Seed runner ────────────────────────────────────────────────────────────
const seedDB = async () => {
  const mongoURI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/quickhire';

  try {
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB Connected for Seeding');

    // Clear existing data
    await Job.deleteMany({});
    await FeaturedJob.deleteMany({});
    console.log('🗑️  Cleared existing jobs and featured jobs');

    // Insert fresh seed data
    const insertedJobs = await Job.insertMany(seedJobs);
    const insertedFeatured = await FeaturedJob.insertMany(seedFeaturedJobs);

    console.log(`✅ Inserted ${insertedJobs.length} latest jobs`);
    console.log(`✅ Inserted ${insertedFeatured.length} featured jobs`);
    console.log('🎉 Database seeded successfully!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDB();
