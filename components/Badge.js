// import { useState } from 'react'

function nFormatter(num, digits) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function(item) {
    return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
}

export default function Badge (props) {
  // const [badgeInfo, setBadgeInfo] = useState(null)
  const badgeInfo = props.data

  if (!badgeInfo) return '...'
  return(
    <div className="card">
      <div className="user" >
        <a href={badgeInfo.url} >
          <img className="avatar" src={badgeInfo.avatarUrl} alt={props.user} />
        </a>
        <div className="user-and-repo">
          <a className="username" href={badgeInfo.url}>{props.user}</a>
          {/* <div className="recent-repo">Worked on <a href={badgeInfo.recentRepo.url}>{badgeInfo.recentRepo.name}</a> recently.</div> */}
        </div>
        
      </div>
      <div className="usage">
        {/* <div className="commits">
          <Sparklines data={Object.values(badgeInfo.lastWeek)} margin={2} >
            <SparklinesBars style={{ stroke: "white", fill: "#41c3f9", margin: "1"}} />
          </Sparklines>
        </div> */}
        <div className="langs">
          {badgeInfo.languages.slice(0, 3).join(', ')}
          {badgeInfo.languages.length > 3 && <span title={badgeInfo.languages.slice(3).join(', ')}>...</span>}
        </div>
      </div>
      <div className="stats">
        <div className="stat">
          <div className="count">{badgeInfo.numOfRepos}</div>
          <div className="label">repos</div>
        </div>
        <div className="stat">
          <div className="count">{nFormatter(badgeInfo.numOfFollowers, 1)}</div>
          <div className="label">followers</div>
        </div>
        <div className="stat">
          <div className="count">{badgeInfo.numOfForks}</div>
          <div className="label">forks</div>
        </div>
        <div className="stat">
          <div className="count">{nFormatter(badgeInfo.numOfStargazers, 1)}</div>
          <div className="label">stargazers</div>
        </div>
      </div>
    </div>
  )
}