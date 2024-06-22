import React from 'react'
import CardHeader from './header'
import CardBody from './body'
import CardFooter from './footer'

const FeedCard = () => {
  return (
    <div className='flex-col flex gap-2 px-8 py-6  border-b  hover:bg-accent  hover:cursor-pointer '> 
    <div className='flex-col flex gap-2 '>
        <CardHeader title="Deneme Burada bi zun bir title
Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada bi zun bir title Deneme" />
 
 <div>
  <span className='flex text-sm text-primary/60'>
  Deneme Burada bi zun bir title Deneme Burada bi zun bir title
Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada bi zun bir title Deneme
Deneme Burada ikinci tane title  var bayada uzun bir title Deneme Burada bi zun bir title Deneme
  </span>
  </div>
       
    </div>
    <CardFooter/>
    </div>
  )
}

export default FeedCard