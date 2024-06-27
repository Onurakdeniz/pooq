import React from 'react'
import SuggestionBoxHeader from './header'
import SuggestionBoxBody from './body'
import SuggestionBoxFooter from './footer'
import {SUGGESTION_BOX_TYPES} from "@/lib/constants"


interface ISuggestionBox {
    type : "FOLLOWERS" | "TAGS" 
}

const SuggestionBox = ({type} : ISuggestionBox) => {
  const { title, Icon: Icon, info } = SUGGESTION_BOX_TYPES[type]
  return (
    <div className='flex-col flex border rounded-lg p-4 gap-4 '>       
        <SuggestionBoxHeader
        title = {title}
        Icon={Icon}
        info={info}

        />
        <SuggestionBoxBody/>
 
    </div>
  )
}

export default SuggestionBox