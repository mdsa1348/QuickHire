const mongoose = require('mongoose');
const { Job } = require('./models');
require('dotenv').config();

const seedJobs = [
  {
    title: 'UI Designer',
    company: 'Nomad',
    location: 'Florence, Italy',
    category: 'Design',
    description: 'We are looking for a UI Designer to help us build the next generation of our product. You will work closely with our product and engineering teams to create beautiful and intuitive interfaces.',
  },
  {
    title: 'UX Researcher',
    company: 'Udacity',
    location: 'Remote',
    category: 'Design',
    description: 'Udacity is looking for a UX Researcher to help us understand our students and how we can better serve them. You will lead research projects and provide insights to our product and design teams.',
  },
  {
    title: 'Android Developer',
    company: 'Uber',
    location: 'San Francisco, CA',
    category: 'Engineering',
    description: 'Uber is looking for an Android Developer to join our core app team. You will work on building new features and improving the performance and reliability of our Android app.',
  },
  {
    title: 'Product Manager',
    company: 'Google',
    location: 'Mountain View, CA',
    category: 'Product',
    description: 'Google is looking for a Product Manager to lead development of a new product. You will define the product vision, strategy, and roadmap, and work with a cross-functional team to bring the product to market.',
  }
];

const seedDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/quickhire';
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected for Seeding');
    
    await Job.deleteMany({});
    await Job.insertMany(seedJobs);
    
    console.log('Database Seeded!');
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

seedDB();
