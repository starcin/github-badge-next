import styles from './Badge.module.css'

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
    <div className={styles.card}>
      <div className={styles.user} >
        <a href={badgeInfo.url} >
          <img className={styles.avatar} src={badgeInfo.avatarUrl} alt={props.user} />
        </a>
        <div>
          <a className={styles.username} href={badgeInfo.url}>{badgeInfo.user}</a>
          {/* <div className="recent-repo">Worked on <a href={badgeInfo.recentRepo.url}>{badgeInfo.recentRepo.name}</a> recently.</div> */}
        </div>
        
      </div>
      <div className={styles.usage}>
        {/* <div className="commits">
          <Sparklines data={Object.values(badgeInfo.lastWeek)} margin={2} >
            <SparklinesBars style={{ stroke: "white", fill: "#41c3f9", margin: "1"}} />
          </Sparklines>
        </div> */}
        <div className={styles.langs}>
          {badgeInfo.languages.slice(0, 3).join(', ')}
          {badgeInfo.languages.length > 3 && <span title={badgeInfo.languages.slice(3).join(', ')}>...</span>}
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.count}>{badgeInfo.numOfRepos}</div>
          <div className={styles.label}>repos</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.count}>{nFormatter(badgeInfo.numOfFollowers, 1)}</div>
          <div className={styles.label}>followers</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.count}>{badgeInfo.numOfForks}</div>
          <div className={styles.label}>forks</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.count}>{nFormatter(badgeInfo.numOfStargazers, 1)}</div>
          <div className={styles.label}>stargazers</div>
        </div>
      </div>
    </div>
  )
}