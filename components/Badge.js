import { useState } from 'react'

export default function Badge (props) {
  const [badgeInfo, setBadgeInfo] = useState(null)

  return(
    <div>
      {props.info.user}
    </div>
  )
}