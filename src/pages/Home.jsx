import React from 'react'
import Hero from '../components/Hero/Hero'
import Services from '../components/Hero/services/Services'
import Philosophy from '../components/Philosophy/Philosophy'
import PricingBanner from '../components/PricingBanner/PricingBanner'
import Testimonial from '../components/Testimonial/Testimonial'

const Home = () => {
  return (
    <div>
        <Hero />
        <Services />
        <Philosophy />
        <PricingBanner />
        <Testimonial />
    </div>
  )
}

export default Home