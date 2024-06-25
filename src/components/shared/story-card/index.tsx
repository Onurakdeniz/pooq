import React from 'react'
import CardHeader from './header'
import CardBody from './body'
import CardFooter from './footer'
import StoryHover from '../story-hover'
import StoryText from './body/text'

const FeedCard = () => {
  return (
    <div className='flex-col flex gap-2 p-8 border-b  hover:bg-accent  hover:cursor-pointer '> 
    <div className='flex-col flex gap-2 '>
        <CardHeader title="Deneme Burada bi zun bir title
Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada bi zun bir title Deneme" />
 
 <div>
  <span className='flex text-sm text-primary/60'>

    <StoryText tokenPattern="st:12323" text="Deneme Burada bi zun bir title st:12323 Deneme Burada bi zun bir title
Deneme Burada ikinci tane title var bayada uzun bir title Deneme Burada bi zun bir title Deneme
Deneme Burada ikinci tane title  var bayada uzun bir title Deneme Burada bi zun bir title Deneme"/> 

  </span>
  </div>
       
    </div>
    <CardFooter/>
    </div>
  )
}

export default FeedCard