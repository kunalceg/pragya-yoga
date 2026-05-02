import React from 'react'
import Hero from '../components/Hero/Hero'
import Services from '../components/Services/Services'
import Philosophy from '../components/Philosophy/Philosophy'
import Membership from '../components/PricingBanner/PricingBanner'
import Testimonial from '../components/Testimonial/Testimonial'
import PartnersSection from "../components/Partner/Partners";


const Home = () => {
  return (
    <div>
        <Hero />
        <Services />
        <Philosophy />
        <Membership />
        <Testimonial />
        <PartnersSection />
    </div>
  )
}

export default Home